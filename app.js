
(function () {
  const statusEl = document.getElementById("status");

  function setStatus(msg, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.toggle("error", isError);
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
      el.value = value ?? "";
    }
  }

  function setCheckbox(id, checked) {
    const el = document.getElementById(id);
    if (el && el instanceof HTMLInputElement && el.type === "checkbox") {
      el.checked = !!checked;
    }
  }

  async function prefillFormFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const recordId = params.get("id");

    if (!recordId) {
      setStatus("No record ID found in the URL (expected ?id=...).", true);
      return;
    }

    setStatus("Loading record…");

    // Use your real Flow URL here
    const flowUrl = "https://defda1cb7753e7fca8dfb11ddc6bac.cb.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/8c37ab07d764413680ea715ed03768a2/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1nG6Iw4QsGgUhnRz1wEMHtEuFLIp-xT_COnp40WaSF4";

    try {
      const res = await fetch(flowUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recordId }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      const data = await res.json();

      // ---- Personal details ----
      setValue("name", data.name);
      setValue("dob", data.dob);             // yyyy-MM-dd
      setValue("smoker", data.smoker);       // "Yes" | "No" | ""
      setValue("height", data.height);
      setValue("weight", data.weight);

      // ---- Employment ----
      setValue("occupation", data.occupation);
      setValue("employmentType", data.employmentType);
      setValue("hours", data.hours);
      setValue("duties", data.duties);

      // If you plan to use these later, keep them; otherwise you can remove:
      // setValue("weightloss", data.weightloss);
      // setValue("druguse", data.druguse);
      // setValue("medications", data.medications);
      // setCheckbox("cond-heart", data.condHeart);
      // setCheckbox("cond-diabetes", data.condDiabetes);
      // setCheckbox("cond-mental", data.condMental);
      // setCheckbox("cond-back", data.condBack);
      // setCheckbox("cond-cancer", data.condCancer);
      // setValue("medicalDetails", data.medicalDetails);
      // setValue("familyHistory", data.familyHistory);
      // setValue("travelPlans", data.travelPlans);

      setStatus("Form prefilled.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to load record. See console for details.", true);
    }
  }

  // Demo submit handler (optional)
  function wireDemoSubmit() {
    const btn = document.getElementById("demoSubmit");
    const form = document.getElementById("preForm");
    if (!btn || !form) return;

    btn.addEventListener("click", () => {
      const payload = {
        name: document.getElementById("name")?.value ?? "",
        dob: document.getElementById("dob")?.value ?? "",
        smoker: document.getElementById("smoker")?.value ?? "",
        height: document.getElementById("height")?.value ?? "",
        weight: document.getElementById("weight")?.value ?? "",
        occupation: document.getElementById("occupation")?.value ?? "",
        employmentType: document.getElementById("employmentType")?.value ?? "",
        hours: document.getElementById("hours")?.value ?? "",
        duties: document.getElementById("duties")?.value ?? ""
      };

      console.log("Demo submit payload:", payload);
      setStatus("Submitted (demo) — see console for payload.");
    });
  }

  // Initialize
  prefillFormFromQuery();
  wireDemoSubmit();
})();
