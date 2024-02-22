// Potential JavaScript function to help with deleting irrigation plans
// May just end up using a Python function

function delAccountIrrigationPlan(irrigationPlanId) {
    fetch("/del-account-irrigation-plan", {
      method: "POST",
      body: JSON.stringify({ irrigationPlanId: irrigationPlanId }),
    }).then((_res) => {
      window.location.href = "/";
    });
  }