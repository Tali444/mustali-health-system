async function run() {
  const projectId = "ai-studio-applet-webapp-c9a0b";
  const apiKey = "AIzaSyDlgQUcA2vBYh2i0PKsmKWo7U5hApt0OMU";
  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/default/documents/facilities`;
  const url = `${base}?key=${apiKey}`;
  console.log("Fetching facilities via REST with API key...");
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`REST API error: ${res.status} ${res.statusText} - ${text}`);
    }
    const data = await res.json();
    console.log("Documents found in 'facilities':", data.documents?.length || 0);
    if (data.documents) {
      data.documents.forEach(doc => {
        const parts = doc.name.split('/');
        const id = parts[parts.length - 1];
        console.log(`\nDocument [${id}]:`);
        console.log(JSON.stringify(doc.fields, null, 2));
      });
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

run();
