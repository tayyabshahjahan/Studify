document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".flashcard");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });
});
