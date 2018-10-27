javascript: (() => {
    Array.from(
        Array.from(document.querySelectorAll("table:nth-of-type(2)"))[1]
            .children[0]
            .children[1]
            .children[0]
            .children
    )
        .filter((book) =>
            Array.from(book.querySelectorAll("span"))
                .map(span => span.innerHTML)
                .includes("Free!")
        )
        .map((table) => {
            return Array.from(table.querySelectorAll("a"))
                .filter(a => ["Amazon", "Google"].includes(a.text));
        })
        .flat()
        .forEach((link) => {
            link.click();
        });
})();