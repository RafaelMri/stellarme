import Link from "next/link";
import Head from "next/head";

export default ({ children, title = "Stellar.To", parentClassName = "" }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/static/style.css" />
    </Head>
    <div className={`${parentClassName}`}>
      <header>
        <nav className="navbar">
          <div className="container">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#navbar"
                aria-expanded="false"
                aria-controls="navbar"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <Link href="/">
                <a className="navbar-brand" href="/">
                  Stellar.To
                </a>
              </Link>
            </div>
            <span className="center-block">
              Running in TestNet. MainNet will be available soon.
            </span>
          </div>
        </nav>
      </header>

      <div className="container body">{children}</div>
      <footer>
        <div className="container">
        <span>GitHub: </span>
            <a
              className="btn btn-info btn-xs"
              href="https://github.com/sureshdurairaj/stellarme"
            >
              StellarTo App
            </a>
          <a
            className="btn btn-info btn-xs"
            href="https://github.com/sureshdurairaj/stellarmedb"
          >
            StellarTo JSON DB Server
          </a>
        </div>
      </footer>
    </div>
  </div>
);
