document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const saunaCards = document.querySelectorAll(".sauna-kortti");
  const statusLine = document.getElementById("sauna-status");

  if (filterButtons.length > 0 && saunaCards.length > 0) {
    function updateSaunas(filter) {
      let visibleCount = 0;

      saunaCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === "kaikki" || category === filter) {
          card.hidden = false;
          visibleCount++;
        } else {
          card.hidden = true;
        }
      });

      if (statusLine) {
        statusLine.textContent = `Näytetään ${visibleCount} / ${saunaCards.length} saunaa`;
      }
    }

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => {
          b.classList.remove("aktiivinen");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("aktiivinen");
        btn.setAttribute("aria-pressed", "true");

        updateSaunas(btn.dataset.filter);
      });
    });

    updateSaunas("kaikki");
  }

  const form = document.querySelector(".varauslomake");

  if (form) {
    const successBox = document.getElementById("onnistui");
    const savedBox = document.getElementById("tallennettu-varaus");
    const fields = form.querySelectorAll("select, input");

    if (successBox) successBox.hidden = true;

    const saved = JSON.parse(localStorage.getItem("kuivasjarvi_varaus"));
    if (saved && savedBox) {
      savedBox.hidden = false;
      savedBox.textContent = `Viimeisin tallennettu varaus: ${saved.sauna} (${saved.paiva}) – ${saved.nimi}, ${saved.puhelin}`;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      fields.forEach((field) => {
        const errorSpan = field.nextElementSibling;
        if (!field.checkValidity()) {
          errorSpan.textContent = "Täytä tämä kenttä oikein.";
          isValid = false;
        } else {
          errorSpan.textContent = "";
        }
      });

      if (isValid) {
        const data = {
          sauna: form.sauna.value,
          paiva: form.paiva.value,
          nimi: form.nimi.value.trim(),
          puhelin: form.puhelin.value.trim()
        };

        localStorage.setItem("kuivasjarvi_varaus", JSON.stringify(data));
        if (savedBox) {
          savedBox.hidden = false;
          savedBox.textContent = `Viimeisin tallennettu varaus: ${data.sauna} (${data.paiva}) – ${data.nimi}, ${data.puhelin}`;
        }
        if (successBox) successBox.hidden = false;
        form.reset();
      }
    });
  }
});
