// Ajouter les boutons à chaque item
document.querySelectorAll('.item').forEach(item => {
  const button = document.createElement('button');
  button.textContent = 'En savoir plus';
  button.className = 'select-btn';
  item.appendChild(button);
  
  // Envelopper tout le contenu sauf le premier div (images) dans un container
  const firstDiv = item.querySelector('div');
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'item-content';
  
  // Déplacer tous les éléments sauf le premier div dans le wrapper
  const children = Array.from(item.children);
  children.forEach(child => {
    if (child !== firstDiv) {
      contentWrapper.appendChild(child);
    }
  });
  
  item.appendChild(contentWrapper);
});

// Fonction pour obtenir tous les items de la même ligne
function getItemsInSameRow(clickedItem) {
  const grid = clickedItem.parentElement;
  const allItems = Array.from(grid.children);
  
  // Obtenir la position de chaque item
  const clickedRect = clickedItem.getBoundingClientRect();
  const clickedTop = clickedRect.top;
  
  // Trouver tous les items qui sont sur la même ligne
  const sameRowItems = allItems.filter(item => {
    const itemRect = item.getBoundingClientRect();
    return Math.abs(itemRect.top - clickedTop) < 5;
  });
  
  return sameRowItems;
}

// Gérer les clics sur les boutons
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('select-btn')) {
    const clickedItem = e.target.closest('.item');
    
    // Vérifier si l'item est déjà sélectionné
    const isAlreadySelected = clickedItem.classList.contains('selected');
    
    // Retirer toutes les classes existantes et styles de tous les items
    document.querySelectorAll('.item').forEach(item => {
      item.classList.remove('selected', 'same-row');
      item.style.width = '';
      
      // Réinitialiser l'affichage des paragraphes
      const pNormal = item.querySelector('.p-normal');
      const pExpanded = item.querySelector('.p-expanded');
      const actionBtn = item.querySelector('.action-btn');
      
      if (pNormal) pNormal.style.display = 'block';
      if (pExpanded) pExpanded.style.display = 'none';
      if (actionBtn) actionBtn.style.display = 'none';
    });
    
    // Si l'item n'était pas déjà sélectionné, le sélectionner
    if (!isAlreadySelected) {
      const sameRowItems = getItemsInSameRow(clickedItem);
      
      // Calculer les nouvelles largeurs
      const totalItems = sameRowItems.length;
      const selectedWidth = 80;
      const remainingWidth = 20;
      const compressedWidth = remainingWidth / (totalItems - 1);
      
      // Ajouter la classe 'selected' à l'item cliqué et définir sa largeur
      clickedItem.classList.add('selected');
      clickedItem.style.width = `calc(${selectedWidth}% - 1%)`;
      
      // Changer l'affichage du contenu pour l'item sélectionné
      const pNormal = clickedItem.querySelector('.p-normal');
      const pExpanded = clickedItem.querySelector('.p-expanded');
      const actionBtn = clickedItem.querySelector('.action-btn');
      
      if (pNormal) pNormal.style.display = 'none';
      if (pExpanded) pExpanded.style.display = 'block';
      if (actionBtn) actionBtn.style.display = 'block';
      
      // Ajouter la classe 'same-row' aux autres items et définir leur largeur
      sameRowItems.forEach(item => {
        if (item !== clickedItem) {
          item.classList.add('same-row');
          item.style.width = `calc(${compressedWidth}% - 1%)`;
        }
      });
    }
  }
});

// Recalculer les lignes lors du redimensionnement de la fenêtre
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Réappliquer les classes si un item est sélectionné
    const selectedItem = document.querySelector('.item.selected');
    if (selectedItem) {
      const sameRowItems = getItemsInSameRow(selectedItem);
      
      // Calculer les nouvelles largeurs
      const totalItems = sameRowItems.length;
      const selectedWidth = 80;
      const remainingWidth = 20;
      const compressedWidth = remainingWidth / (totalItems - 1);
      
      // Retirer les classes 'same-row' de tous les items
      document.querySelectorAll('.item').forEach(item => {
        item.classList.remove('same-row');
        item.style.width = '';
      });
      
      // Réappliquer la largeur à l'item sélectionné
      selectedItem.style.width = `calc(${selectedWidth}% - 1%)`;
      
      // Réappliquer aux items de la même ligne
      sameRowItems.forEach(item => {
        if (item !== selectedItem) {
          item.classList.add('same-row');
          item.style.width = `calc(${compressedWidth}% - 1%)`;
        }
      });
    }
  }, 250);
});