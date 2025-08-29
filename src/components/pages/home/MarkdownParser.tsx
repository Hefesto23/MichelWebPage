// Server Component para parsing de markdown
export const parseMarkdownToJSX = (content: string) => {
  return content
    .split('\n\n')
    .map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      
      if (!trimmedParagraph) return null;
      
      // Lista numerada
      if (trimmedParagraph.match(/^\d\./)) {
        const listItems = trimmedParagraph
          .split('\n')
          .filter(item => item.match(/^\d\./))
          .map((item) => {
            const text = item.replace(/^\d\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
            return `<li>${text}</li>`;
          });
        
        return (
          <ol key={index} className="list-decimal" dangerouslySetInnerHTML={{
            __html: listItems.join('')
          }} />
        );
      }
      
      // Lista com bullets
      if (trimmedParagraph.match(/^•/)) {
        const listItems = trimmedParagraph
          .split('\n')
          .filter(item => item.match(/^•/))
          .map((item) => {
            const text = item.replace(/^•\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
            return `<li>${text}</li>`;
          });
        
        return (
          <ul key={index} className="list-disc" dangerouslySetInnerHTML={{
            __html: listItems.join('')
          }} />
        );
      }
      
      // Parágrafo normal
      const formattedText = trimmedParagraph
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: formattedText }} />
      );
    })
    .filter(Boolean);
};