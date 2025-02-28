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

// udey code
async function updateOrgHierarchy(req, res) {
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
        } = req.body;

        const orgId = req.member.organization_id;
        const notification_title = 'department updated';
        const member_ids = await getOnlyAdmins(orgId);

        if (action === 'add') {
            if (parent_entity_id && ['member', 'assistant'].includes(entity_type)) {
                const parentOrgHierarchyDetails = await OrganizationHierarchyModel.findOne({
                    entity_id: parent_entity_id
                });

                if (is_sibling) {
                    parentOrgHierarchyDetails.children.push(entity_id);
                    await Promise.all([
                        memberModel.findOneAndUpdate(
                            { _id: entity_id },
                            { $set: { designation: job_title } },
                            { new: true }
                        ),
                        OrganizationHierarchyModel.create({
                            entity_id,
                            entity_type,
                            parent_entity_id,
                            organization_id: req.member.organization_id,
                            jobTitle: job_title,
                            children: [],
                        }),
                        OrganizationHierarchyModel.findOneAndUpdate(
                            { entity_id: parent_entity_id },
                            {
                                $set: {
                                    children: parentOrgHierarchyDetails.children,
                                },
                            },
                            { returnOriginal: false }
                        ),
                    ]);
                } else {
                    const childrenAssistantDetails = await OrganizationHierarchyModel.find({
                        $and: [
                            {
                                entity_id: { $in: parentOrgHierarchyDetails.children },
                            },
                            { entity_type: 'assistant' },
                        ],
                    });

                    const oldParentChildren = childrenAssistantDetails.map((obj) =>
                        obj.entity_id.toString());
                    oldParentChildren.push(entity_id);

                    const newParentChildren = [];
                    parentOrgHierarchyDetails.children.map((elem) => {
                        if (!oldParentChildren.includes(elem)) {
                            newParentChildren.push(elem);
                        }
                    });

                    await Promise.all([
                        memberModel.findOneAndUpdate(
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
                            organization_id: req.member.organization_id
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
                    departmentModel.findOne({ _id: entity_id }),
                    OrganizationHierarchyModel.findOne({
                        entity_id: parent_entity_id,
                    }),
                ]);

                if (is_sibling) {
                    parentOrgHierarchyDetails.children.push(entity_id);
                    await Promise.all([
                        OrganizationHierarchyModel.create({
                            entity_id,
                            entity_type,
                            parent_entity_id,
                            organization_id: req.member.organization_id,
                            department_name: department.department_name,
                            jobTitle: job_title,
                            children: [],
                            unique_initial: department.unique_initial, // Add this line
                        }),
                        OrganizationHierarchyModel.findOneAndUpdate(
                            { entity_id: parent_entity_id },
                            {
                                $set: {
                                    children: parentOrgHierarchyDetails.children,
                                },
                            },
                            { returnOriginal: false }
                        ),
                    ]);
                } else {
                    await Promise.all([
                        memberModel.findByIdAndUpdate(
                            { _id: entity_id },
                            { designation: job_title }
                        ),
                        OrganizationHierarchyModel.create({
                            entity_id,
                            entity_type,
                            parent_entity_id,
                            organization_id: req.member.organization_id,
                            department_name: department.department_name,
                            jobTitle: job_title,
                            children: parentOrgHierarchyDetails.children,
                            unique_initial: department.unique_initial, // Add this line
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
                    organization_id: req.member.organization_id,
                    children: [],
                });
            } else {
                const department = await departmentModel.findOne({ _id: entity_id });
                await OrganizationHierarchyModel.create({
                    entity_id,
                    entity_type,
                    parent_entity_id,
                    department_name: department.department_name,
                    organization_id: member.organization_id,
                    jobTitle: job_title,
                    unique_initial: department.unique_initial, // Add this line
                    children: [],
                });
            }

            const responseData = {
                meta: {
                    code: 200,
                    success: true,
                    message: 'Member added to the organization.',
                },
                data: null,
            };

            return res.status(responseData.meta.code).json(responseData);
        }

        if (action === 'change_manager') {
            const [oldManager, parentDetails] = await Promise.all([
                OrganizationHierarchyModel.findOne({ entity_id: old_manager_id }),
                OrganizationHierarchyModel.findOne({ children: { $in: [old_manager_id] } })
            ]);

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
                )
            ]);

            const notify_type = 'change-manager';
            createNotification('', oldManager.fullName, member_ids, oldManager.entity_id,
                orgId, notification_title, notify_type);

            const responseData = {
                meta: {
                    code: 200,
                    success: true,
                    message: 'Manager changed.',
                },
                data: null,
            };
            return res.status(responseData.meta.code).json(responseData);
        }

        const responseData = {
            meta: {
                code: 500,
                success: false,
                message: 'Error in change manager operation.',
            },
        };

        return res.status(responseData.meta.code).json(responseData);
    } catch (error) {
        console.error(error);

        const responseData = {
            meta: {
                code: 500,
                success: false,
                message: 'Error creating organization member.',
            },
        };

        return res.status(responseData.meta.code).json(responseData);
    }
}


async function getOrgHierarchy(req, res) {
    try {

        const result = await OrganizationHierarchyModel.aggregate([
            {
                $match: {
                    organization_id: req.member.organization_id,
                },
            },
            {
                $lookup: {
                    from: "members",
                    localField: "entity_id",
                    foreignField: "_id",
                    as: "entityDetails",
                },
            },
            {
                $unwind: {
                    path: "$entityDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    entity_id: 1,
                    children: 1,
                    parent_entity_id: 1,
                    organization_id: 1,
                    jobTitle: 1,
                    entity_type: 1,
                    department_name: 1,
                    unique_initial: 1,
                    // Fields from the populated `entity_id`
                    photo: "$entityDetails.photo",
                    fullName: "$entityDetails.fullName",
                    email: "$entityDetails.email",
                    phoneNumber: "$entityDetails.phoneNumber",
                },
            },
        ]);
        const responseData = {
            meta: {
                code: 200,
                success: true,
                message: '',
            },
            data: {
                hierarchy: result.length ? transformDataToD3Tree(result) : {},
                is_admin: req.member.is_admin ? 1 : 0,
                isCollaborator: req.member.isCollaborator ? 1 : 0,
            },
        };

        return res.status(responseData.meta.code).json(responseData);
    } catch (error) {
        console.error(error);
        const responseData = {
            meta: {
                code: 500,
                success: false,
                message: 'Error retrieving organization hierarchy.',
            },
        };

        return res.status(responseData.meta.code).json(responseData);
    }
}


async function removeRole(req, res) {
    try {
        let responseData;
        const { entity_id, new_manager_id } = req.body;
        const parentDetails = await OrganizationHierarchyModel.findOne({
            children: { $in: [entity_id] },
        });
        let parent_id;
        if (parentDetails) {
            parent_id = parentDetails.entity_id;
        }
        if (entity_id && !new_manager_id) {
            // Removing the member and updating the parent's children list
            await Promise.all([
                OrganizationHierarchyModel.findOneAndRemove({ entity_id }),
                OrganizationHierarchyModel.updateOne(
                    { entity_id: parent_id },
                    { $pull: { children: entity_id } },
                ),
            ]);
            responseData = {
                meta: {
                    code: 200,
                    success: true,
                    message: 'Member removed successfully from organization hierarchy',
                },
            };
            return res.status(responseData.meta.code).json(responseData);
        }

        // Retrieving old manager details
        const oldManager = await OrganizationHierarchyModel.findOne({ entity_id });

        // Retrieving A's children
        const aChildren = oldManager.children;

        // Removing A and transferring A's children to B
        await Promise.all([
            OrganizationHierarchyModel.findOneAndUpdate(
                { entity_id },
                { $set: { children: [] } },
            ),
            OrganizationHierarchyModel.findOneAndUpdate(
                { entity_id: new_manager_id },
                { $push: { children: { $each: aChildren } } },
            ),
            OrganizationHierarchyModel.findOneAndRemove({ entity_id }),
            OrganizationHierarchyModel.updateOne(
                { entity_id: parent_id },
                { $pull: { children: entity_id } },
            ),
            // Set the parent_entity_id to the new manager's entity_id for the old manager and its children
            OrganizationHierarchyModel.updateMany(
                { parent_entity_id: entity_id },
                { $set: { parent_entity_id: new_manager_id } }
            )
        ]);

        responseData = {
            meta: {
                code: 200,
                success: true,
                message: 'Member removed successfully! Children changed to new manager.',
            },
        };
        return res.status(responseData.meta.code).json(responseData);
    } catch (error) {
        const responseData = {
            meta: {
                code: 200,
                success: false,
                message: 'Something went wrong while removing member from organization hierarchy.',
            },
        };
        return res.status(responseData.meta.code).json(responseData);
    }
}
