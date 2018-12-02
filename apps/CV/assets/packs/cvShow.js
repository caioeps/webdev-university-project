(() => {
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('cv-show')) return;

    Array.from(document.getElementsByClassName('sections')).forEach(section => {
      InlineEditor.create(section).then(editor => editor.isReadOnly = true);
    });
  });
})();
