document.querySelector('.operation-form').addEventListener('submit',event=>{
  event.preventDefault();
  const parts=document.querySelector('#source-path').value.trim().split('/');
  document.querySelector('#operation-result').textContent=parts.length===3&&parts.every(part=>part.trim())
    ? `Collection: ${parts[0]} · Document: ${parts[1]} · Version: ${parts[2]}`
    : 'Use three non-empty parts: collection/document/version.';
});
