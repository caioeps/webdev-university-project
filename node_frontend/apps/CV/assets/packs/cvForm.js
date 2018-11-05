(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const sections = document.getElementById('cv-sections');
    const button = document.querySelector('.add-new-cv-section');

    const outerClasses = 'row mt-2'

    const newSectionHtml = `
      <div class="col-sm-12 text-right">
        <p class="text-right remove">
          <span style="cursor: pointer">
            Remove
          </span>
        </p>
      </div>
      <div class="col-sm-12">
        <textarea name="sections[]" class="ckeditor">
        </textarea>
      </div>
    `;

    Array.from(document.getElementById('cv-sections').children).forEach(child => {
      ClassicEditor.create(child.getElementsByClassName('ckeditor')[0])
    })

    function appendEditor() {
      let newDiv = document.createElement('div');
      newDiv.classList = outerClasses;
      newDiv.innerHTML = newSectionHtml;
      sections.appendChild(newDiv);

      ClassicEditor
        .create(document.getElementById('cv-sections').lastChild.getElementsByClassName('ckeditor')[0])

      return newDiv;
    }

    function addRemoveBehaviorToCloseButton(createdElement) {
      const closeButton = createdElement.querySelector('p.remove > span');

      closeButton.addEventListener('click', (e) => {
        createdElement.parentElement.removeChild(createdElement)
      });
    }

    button.addEventListener('click', (e) => {
      const newDiv = appendEditor();
      addRemoveBehaviorToCloseButton(newDiv);
    });
  }, false);
})();
