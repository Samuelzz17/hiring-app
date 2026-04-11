"use server";

import { getAdminDb, getAdminStorage } from "@/db/firestore";

export async function getApplicationDetails(applicationId: string) {
  try {
    const db = getAdminDb();
    const appDocRef = db.collection("applications").doc(applicationId);
    const appDoc = await appDocRef.get();

    if (!appDoc.exists) {
      throw new Error("Application not found");
    }

    const applicationData = appDoc.data();
    let downloadUrl = null;

    // Check if there is a CV stored in Firebase Storage
    if (applicationData?.cvFilePath && applicationData.cvFilePath.startsWith("gs://")) {
      const storage = getAdminStorage();
      const bucketName = applicationData.cvFilePath.split('/')[2];
      const filePath = applicationData.cvFilePath.split('/').slice(3).join('/');
      
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(filePath);
      
      // Generate a signed URL that expires in 1 hour
      const [url] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, 
      });
      downloadUrl = url;
    }

    return {
      success: true,
      data: {
        applicationId: appDoc.id,
        candidateId: applicationData?.candidateId,
        fitScore: applicationData?.fitScore,
        fitExplanation: applicationData?.fitExplanation,
        cvText: applicationData?.cvText,
        extractedJson: applicationData?.extractedJson,
        cvFileName: applicationData?.cvFileName,
        cvDownloadUrl: downloadUrl,
      }
    };
  } catch (error: any) {
    console.error("Error fetching application details:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch application details"
    };
  }
}
