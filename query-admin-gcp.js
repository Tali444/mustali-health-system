import fs from 'fs';

async function getAccessToken() {
  const url = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
  const res = await fetch(url, { headers: { 'Metadata-Flavor': 'Google' } });
  if (!res.ok) {
    throw new Error(`Failed to get token: ${res.statusText}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function run() {
  const projectId = "ai-studio-applet-webapp-c9a0b";
  try {
    const token = await getAccessToken();
    console.log("Acquired GCP OAuth2 token successfully.");
    
    // Test default database first, then (default) if that fails
    const dbs = ['default', '(default)'];
    for (const dbId of dbs) {
      console.log(`\n--- Fetching database: ${dbId} ---`);
      // URI encode the database ID just in case
      const encodedDbId = encodeURIComponent(dbId);
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${encodedDbId}/documents/facilities`;
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        console.log(`DB ${dbId} failed: ${res.status} ${res.statusText}`);
        const errDetails = await res.text();
        console.log(errDetails);
      } else {
        const data = await res.json();
        console.log(`DB ${dbId} SUCCESS! Found ${data.documents?.length || 0} documents.`);
        if (data.documents) {
          data.documents.forEach(doc => {
            const parts = doc.name.split('/');
            const id = parts[parts.length - 1];
            console.log(`\nDocument [${id}]:`, JSON.stringify(doc.fields, null, 2));
          });
        }
      }
    }
  } catch (error) {
    console.error("Error running query-admin-gcp:", error);
  }
  process.exit(0);
}

run();
