async function getDriveFilesToUpload(req, res) {
    try {
        const { workspace_sequence_id, design_id } = req.query;


        // Step 1: Retrieve the workspace and its refresh token
        const workspace = await pdmWorkspaceModel.findOne({
            organization_id: req.member.organization_id,
            sequence_id: workspace_sequence_id,
        });


        if (!workspace || !workspace.drive_token.refresh_token) {
            return res.status(400).json({
                meta: {
                    code: 400,
                    success: false,
                    message: "Invalid workspace or missing refresh token",
                },
            });
        }


        // Step 2: Set up OAuth2 client with refresh token
        oauth2Client.setCredentials({
            refresh_token: workspace.drive_token.refresh_token,
        });


        // Step 3: Retrieve the design files data from the database
        const designFilesData = await DesignVersionModel.findOne(
            { design_id: design_id },
            { files: 1 }
        );


        if (!designFilesData || !designFilesData.files || designFilesData.files.length === 0) {
            return res.status(404).json({
                meta: {
                    code: 404,
                    success: false,
                    message: "No files found for the provided design ID",
                },
            });
        }


        // Step 4: Process files - Download and upload to S3
        const drive = google.drive({ version: "v3", auth: oauth2Client });
        const fileIds = designFilesData.files.map((file) => file.drive_file_id);


        const uploadedFiles = await Promise.all(
            fileIds.map(async (fileId) => {
                try {
                    // Fetch the file metadata from Google Drive
                    const fileMetadataResponse = await drive.files.get({
                        fileId: fileId,
                        fields: "id, name, mimeType, size",
                    });


                    if (!fileMetadataResponse || !fileMetadataResponse.data) {
                        throw new Error(`No metadata found for file ID: ${fileId}`);
                    }


                    const fileMetadata = fileMetadataResponse.data;


                    // Generate unique S3 key
                    const organizationId = req.member.organization_id;
                    const uniqueSuffix = Math.random().toString(36).substring(2, 15); // Random suffix
                    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
                    const s3Key = `${organizationId}/designs/${organizationId}_designs_upload_${timestamp}_${uniqueSuffix}_${fileMetadata.name}`;


                    // Stream the file from Google Drive
                    const driveStream = await drive.files.get(
                        { fileId: fileId, alt: "media" },
                        { responseType: "stream" }
                    );


                    // Upload to S3
                    const s3 = req.app.get('s3');
                    const bucketName = 'marathon-org-assets';


                    await s3.upload({
                        Bucket: bucketName,
                        Key: s3Key,
                        Body: driveStream.data,
                        ContentType: fileMetadata.mimeType,
                    }).promise();


                    // Return the constructed file details
                    return {
                        drive_file_id: fileMetadata.id,
                        file_name: fileMetadata.name,
                        mime_type: fileMetadata.mimeType,
                        s3_key: s3Key,
                    };
                } catch (error) {
                    console.error(`Error processing file ID ${fileId}:`, error.message);
                    return null;
                }
            })
        );


        const validFiles = uploadedFiles.filter((file) => file !== null);


        // Step 5: Update the design document with S3 keys
        const updatedFiles = designFilesData.files.map((file) => {
            const uploadedFile = validFiles.find(
                (uploaded) => uploaded.drive_file_id === file.drive_file_id
            );
            return uploadedFile
                ? { ...file, key: uploadedFile.s3_key }
                : file;
        });


        await DesignVersionModel.updateOne(
            { design_id: design_id },
            { $set: { files: updatedFiles } }
        );


        // Step 6: Respond with file upload details
        const responseData = {
            meta: {
                code: 200,
                success: true,
                message: "Files uploaded and updated successfully",
            },
            data: {
                uploadedFiles: validFiles,
                updatedFiles,
            },
        };


        return res.status(responseData.meta.code).json(responseData);
    } catch (error) {
        console.error("Error in getDriveFilesToUpload:", error);


        const responseData = {
            meta: {
                code: 500,
                success: false,
                message: "Something went wrong!",
            },
        };


        return res.status(responseData.meta.code).json(responseData);
    }
}


