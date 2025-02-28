async function updateOrgHierarchyCommon(req, res, modelType) {
    try {
        const {
            action,
            entity_id,
            job_title,
            parent_entity_id,
            is_sibling,
            entity_type,
            old_manager_id,
            new_manager_id,
            uuid,
        } = req.body;

        const isNextModel = modelType === 'next'; // Determines which model to use
        const OrganizationHierarchyModel = isNextModel ? OrganizationHierarchyNextModel : OrganizationHierarchyModel;
        const memberModelType = isNextModel ? memberNextModel : memberModel;
        const departmentModelType = isNextModel ? departmentNextModel : departmentModel;
        const organizationModelType = isNextModel ? organizationNextModel : organizationModel;

        let orgId = isNextModel ? await organizationModelType.findOne({ uuid }) : req.member.organization_id;

        if (!orgId) {
            return res.status(400).json({ success: false, message: 'Organization not found' });
        }

        if (action === 'add') {
            if (parent_entity_id && ['member', 'assistant'].includes(entity_type)) {
                const parentOrgHierarchyDetails = await OrganizationHierarchyModel.findOne({ 
                    entity_id: parent_entity_id });

                if (!parentOrgHierarchyDetails) {
                    return res.status(400).json({ success: false, message: 'Parent entity not found' });
                }

                if (is_sibling) {
                    parentOrgHierarchyDetails.children.push(entity_id);
                    await Promise.all([
                        memberModelType.findOneAndUpdate(
                            { _id: entity_id },
                            { $set: { designation: job_title } },
                            { new: true }
                        ),
                        OrganizationHierarchyModel.create({
                            entity_id,
                            entity_type,
                            parent_entity_id,
                            organization_id: orgId._id || orgId,
                            jobTitle: job_title,
                            children: [],
                        }),
                        OrganizationHierarchyModel.findOneAndUpdate(
                            { entity_id: parent_entity_id },
                            { $set: { children: parentOrgHierarchyDetails.children } },
                            { returnOriginal: false }
                        ),
                    ]);
                } else {
                    const childrenAssistantDetails = await OrganizationHierarchyModel.find({
                        entity_id: { $in: parentOrgHierarchyDetails.children },
                        entity_type: 'assistant',
                    });

                    const oldParentChildren = childrenAssistantDetails.map((obj) => obj.entity_id.toString());
                    oldParentChildren.push(entity_id);

                    const newParentChildren = parentOrgHierarchyDetails.children.filter(
                        (elem) => !oldParentChildren.includes(elem)
                    );

                    await Promise.all([
                        memberModelType.findOneAndUpdate(
                            { _id: entity_id },
                            { $set: { designation: job_title } },
                            { new: true }
                        ),
                        OrganizationHierarchyModel.create({
                            entity_id,
                            entity_type,
                            parent_entity_id,
                            jobTitle: job_title,
                            children: newParentChildren,
                            organization_id: orgId._id || orgId
                        }),
                        OrganizationHierarchyModel.findOneAndUpdate(
                            { entity_id: parent_entity_id },
                            { $set: { children: oldParentChildren } },
                            { returnOriginal: false }
                        ),
                    ]);
                }
            } else if (parent_entity_id && entity_type === 'department') {
                const [department, parentOrgHierarchyDetails] = await Promise.all([
                    departmentModelType.findOne({ _id: entity_id }),
                    OrganizationHierarchyModel.findOne({ entity_id: parent_entity_id }),
                ]);

                if (!department) {
                    return res.status(400).json({ success: false, message: 'Department not found' });
                }

                if (is_sibling) {
                    parentOrgHierarchyDetails.children.push(entity_id);
                    await Promise.all([
                        OrganizationHierarchyModel.create({
                            entity_id,
                            entity_type,
                            parent_entity_id,
                            organization_id: orgId._id || orgId,
                            department_name: department.department_name,
                            jobTitle: job_title,
                            children: [],
                            unique_initial: department.unique_initial,
                        }),
                        OrganizationHierarchyModel.findOneAndUpdate(
                            { entity_id: parent_entity_id },
                            { $set: { children: parentOrgHierarchyDetails.children } },
                            { returnOriginal: false }
                        ),
                    ]);
                } else {
                    await Promise.all([
                        memberModelType.findByIdAndUpdate(
                            { _id: entity_id },
                            { designation: job_title }
                        ),
                        OrganizationHierarchyModel.create({
                            entity_id,
                            entity_type,
                            parent_entity_id,
                            organization_id: orgId._id || orgId,
                            department_name: department.department_name,
                            jobTitle: job_title,
                            children: parentOrgHierarchyDetails.children,
                            unique_initial: department.unique_initial,
                        }),
                        OrganizationHierarchyModel.findOneAndUpdate(
                            { entity_id: parent_entity_id },
                            { $set: { children: [entity_id] } },
                            { returnOriginal: false }
                        ),
                    ]);
                }
            } else if (['member', 'assistant'].includes(entity_type)) {
                await OrganizationHierarchyModel.create({
                    entity_id,
                    entity_type,
                    parent_entity_id,
                    jobTitle: job_title,
                    organization_id: orgId._id || orgId,
                    children: [],
                });
            } else {
                const department = await departmentModelType.findOne({ _id: entity_id });
                if (!department) {
                    return res.status(400).json({ success: false, message: 'Department not found' });
                }
                await OrganizationHierarchyModel.create({
                    entity_id,
                    entity_type,
                    parent_entity_id,
                    department_name: department.department_name,
                    organization_id: orgId._id || orgId,
                    jobTitle: job_title,
                    unique_initial: department.unique_initial,
                    children: [],
                });
            }

            return res.status(200).json({ success: true, message: 'Entity added successfully' });
        }

        if (action === 'change_manager') {
            const [oldManager, parentDetails] = await Promise.all([
                OrganizationHierarchyModel.findOne({ entity_id: old_manager_id }),
                OrganizationHierarchyModel.findOne({ children: { $in: [old_manager_id] } }),
            ]);

            if (!oldManager || !parentDetails) {
                return res.status(400).json({ success: false, message: 'Manager not found' });
            }

            await OrganizationHierarchyModel.findOneAndUpdate(
                { entity_id: parentDetails.entity_id },
                { $pull: { children: old_manager_id } }
            );

            await OrganizationHierarchyModel.findOneAndUpdate(
                { entity_id: new_manager_id },
                { $push: { children: oldManager.entity_id } }
            );

            await Promise.all([
                OrganizationHierarchyModel.findOneAndUpdate(
                    { entity_id: old_manager_id },
                    { $set: { parent_entity_id: new_manager_id } }
                ),
                OrganizationHierarchyModel.updateMany(
                    { parent_entity_id: old_manager_id },
                    { $set: { parent_entity_id: new_manager_id } }
                ),
            ]);

            return res.status(200).json({ success: true, message: 'Manager changed successfully' });
        }

        return res.status(400).json({ success: false, message: 'Invalid action' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}