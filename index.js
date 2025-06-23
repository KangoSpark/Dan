document.getElementById("generateButton").addEventListener("click", async () => {
  const getValue = (id) => document.getElementById(id)?.value || "";

  const getCheckedOutputs = () =>
    Array.from(document.querySelectorAll("input[name='output']:checked")).map(
      (el) => el.value
    );

  const body = {
    brand: getValue("brandname"),
    product: getValue("productorservice"),
    audience: getValue("audience"),
    idea: getValue("coreidea"),
    tone: getValue("tone")?.split(",").map((t) => t.trim()),
    output: getCheckedOutputs(),
  };

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  document.getElementById("suggestions").innerText = data.result || "No result.";
});