async function run() {
  const projectId = "ai-studio-applet-webapp-c9a0b";
  const apiKey = "AIzaSyDlgQUcA2vBYh2i0PKsmKWo7U5hApt0OMU";
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases?key=${apiKey}`;
  console.log("Listing databases...");
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
run();
