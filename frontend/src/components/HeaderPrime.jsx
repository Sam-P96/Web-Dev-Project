function HeaderPrime(para1, header1, para2) {
    return (
        <section className="listings-header">
            <div>
                <p className="section-label">{para1}</p>
                <h1>{header1}</h1>
                <p>{para2}</p>
            </div>
        </section>
    )
}

export default HeaderPrime;