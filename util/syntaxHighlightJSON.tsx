const jsonStyles = 
`
.key {
    color: #d32f2f;
}

.string {
    color: #1976d2;
}

.number {
    color: #388e3c;
}

.boolean {
    color: #c2185b;
}

.null {
    color: #f57c00;
}
`;

const syntaxHighlightJSON = (json: string) => {
    const highlightedJson = json.replace(/("(.*?)":)|("(.*?)")|(\w+)|\n| /g, (match) => {
        let className = 'string';

        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                className = 'key';
            } else {
                className = 'string';
            }
        } else if (/^\d+$/.test(match)) {
            className = 'number';
        } else if (match === 'true' || match === 'false') {
            className = 'boolean';
        } else if (match === 'null') {
            className = 'null';
        } else if (match === '\n') {
            return '<br />';
        }

        return `<span class="${className}">${match}</span>`;
    });

    return (
        <div>
            <style dangerouslySetInnerHTML={{ __html: jsonStyles }} />
            <pre title="Click to copy" dangerouslySetInnerHTML={{ __html: highlightedJson }} />
        </div>
    );
}

export default syntaxHighlightJSON