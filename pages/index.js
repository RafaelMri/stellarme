import React from "react";
import { bindActionCreators } from "redux";
import { initStore, addNewPairtoDB, loaderStart } from "../store";
import withRedux from "next-redux-wrapper";

import Layout from "../components/layout";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      isValidNewPair: "",
      publicKey: "",
      loaderInfo: {},
      addedNewPairInfo: {
        isNewPairAddSuccess: "",
        addedUsername: ""
      }
    };
  }
  componentDidMount() {
    console.log("cdm props", this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.addedNewPairInfo !== nextProps.addedNewPairInfo) {
      this.setState({ addedNewPairInfo: nextProps.addedNewPairInfo });
    }
  }

  handlePublicKeyChange = e => {
    this.setState({ publicKey: e.target.value });
  };

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  handleSubmitNewPair = () => {
    console.log("submit");
    if (
      /^[a-z0-9]+$/i.test(this.state.username) &&
      /^[a-z0-9]+$/i.test(this.state.publicKey)
    ) {
      this.setState({ isNewPairAddSuccess: "", isValidNewPair: "" }, () =>
        this.props.addNewPairtoDB(this.state.username, this.state.publicKey)
      );
    } else {
      this.setState({ isValidNewPair: false });
    }
  };

  render() {
    return (
      <Layout parentClassName="homepage" title="Stellar.To - Your personalized Stellar Payment Link">
        <div className="container-fluid">
          <div>{this.props.loaderInfo.loaderText}</div>
          <div className="row">
            <div className="col-md-12">
              <h2 className="text-uppercase">
                Your personalized Stellar Payment Link to get paid.
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h3>Just 3 steps to do,</h3>
              <ol>
                <li>Choose a Unique name</li>
                <li>Enter your Stellar Public address</li>
                <li>Click "Get My Link" button</li>
              </ol>
            </div>
            <div className="col-md-6">
              <form>
                <div className="form-group">
                  <label>Unique name</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    value={this.state.username}
                    onChange={this.handleUsernameChange}
                  />
                </div>
                <div className="form-group">
                  <label>Your Stellar Public Address</label>
                  <input
                    required
                    type="text"
                    className="form-control"
                    value={this.state.publicKey}
                    onChange={this.handlePublicKeyChange}
                  />
                </div>
              </form>
              {this.state.isValidNewPair === false ? (
                <p className="text-danger">
                  Only numbers and alphabets allowed.
                </p>
              ) : (
                ""
              )}
              <button
                className="btn btn-primary"
                disabled={
                  this.state.username === "" || this.state.publicKey == ""
                }
                onClick={this.handleSubmitNewPair}
              >
                Get My Link
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {this.state.addedNewPairInfo.isNewPairAddSuccess ? (
                <div className="text-center">
                  <h3>Here's Your Personal Link</h3>
                  <h3 className="unique-link">
                    <span class="glyphicon glyphicon-ok" aria-hidden="true" />
                    <a href={`/${this.state.addedNewPairInfo.addedUsername}`}>
                      www.stellar.to/{this.state.addedNewPairInfo.addedUsername}
                    </a>{" "}
                    <br />
                    <span class="glyphicon glyphicon-send" aria-hidden="true" />
                    <a
                      href={`/${this.state.addedNewPairInfo.addedUsername}/450`}
                    >
                      www.stellar.to/{this.state.addedNewPairInfo.addedUsername}/450
                    </a>{" "}
                    to quote.
                  </h3>
                </div>
              ) : this.state.addedNewPairInfo.isNewPairAddSuccess === false ? (
                <h3 className="text-center">
                  <span
                    class="glyphicon glyphicon-warning-sign"
                    aria-hidden="true"
                  />{" "}
                  Sorry, this name already taken. Please try another name.
                </h3>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addNewPairtoDB: bindActionCreators(addNewPairtoDB, dispatch)
  };
}
function mapStateToProps(state) {
  return {
    loaderInfo: state.loaderInfo,
    addedNewPairInfo: state.addedNewPairInfo
  };
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  HomePage
);
