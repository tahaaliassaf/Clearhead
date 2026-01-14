const affirmations = [
  "You're not lazy. You're overloaded.",
  "Clarity beats motivation.",
  "You don’t need to do more. You need less.",
  "Busy isn’t progress.",
  "Your brain isn’t broken."
];

function processDump() {
  const text = document.getElementById("dump").value;
  if (!text.trim()) return;

  const items = text.split("\n").filter(i => i.trim());

  const draining = [];
  const important = [];
  const low = [];

  items.forEach(item => {
    const t = item.toLowerCase();

    if (/stress|urgent|money|overdue|problem|late/.test(t)) {
      draining.push(item);
    } else if (/plan|build|learn|create|work|call/.test(t)) {
      important.push(item);
    } else {
      low.push(item);
    }
  });

  const focus = draining[0] || important[0] || "Rest. Nothing urgent today.";
  localStorage.setItem("clearheadData", JSON.stringify({ draining, important, low, focus }));
  render(draining, important, low, focus);
}

function render(d, i, l, f) {
  const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  document.getElementById("results").innerHTML = `
    <p><em>${affirmation}</em></p>

    <div class="section"><h3>🔴 Draining</h3><ul>${d.map(x => `<li>${x}</li>`).join("")}</ul></div>
    <div class="section"><h3>🟡 Important</h3><ul>${i.map(x => `<li>${x}</li>`).join("")}</ul></div>
    <div class="section"><h3>🟢 Not Worth Your Energy</h3><ul>${l.map(x => `<li>${x}</li>`).join("")}</ul></div>

    <div class="focus">
      My Only Job Today:<br><strong>${f}</strong><br><br>
      <button onclick="shareFocus()">Share</button>
    </div>
  `;
}

function shareFocus() {
  const text = document.querySelector(".focus strong").innerText;
  const shareText = `My only job today:\n"${text}"\n\nClear your head →`;

  if (navigator.share) {
    navigator.share({
      title: "ClearHead",
      text: shareText,
      url: window.location.href
    });
  } else {
    alert("Copy and share:\n\n" + shareText);
  }
}

window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("clearheadData"));
  if (saved) render(saved.draining, saved.important, saved.low, saved.focus);
};
