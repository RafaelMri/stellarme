import React from "react";
import { bindActionCreators } from "redux";
import {
  initStore,
  getSenderAccountDetails,
  loaderStart,
  getSenderAccountHistory,
  getReceiverAccountDetails,
  sendPayment,
  clearPaymentandSenderInfo
} from "../store";
import withRedux from "next-redux-wrapper";

import Layout from "../components/layout";
import SenderAccountHistory from "../components/SenderAccountHistory";

class StellarMe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secretKey: "SAY7IXRUGERQHGJ6S6EVCHYTYBXXOCDGE22W5LG74T3RUAW5WXBBNXTL",
      senderAccountDetails: {},
      receiverAccountDetails: {
        receiverPublicAddress: "",
        receiverAmount: 1,
        receiverAssetType: "XLM"
      },
      loaderInfo: {},
      // enableTransferButton: false,
      transactionStep: 0
    };
  }
  static async getInitialProps({ query }) {
    // const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { query };
  }
  componentDidMount() {
    console.log("cdm props", this.props);
    // if (
    //     1
    //   this.props.url.query &&
    //   this.props.url.query.cProps &&
    //   this.props.url.query.cProps.reqParams &&
    //   this.props.url.query.cProps.reqParams.length
    // ) {
    console.log("inside cdm if");
    const receiverUsername =
      this.props.url.query.cProps &&
      this.props.url.query.cProps.reqParams.username
        ? this.props.url.query.cProps.reqParams.username
        : "";
    const receiverAmount =
      this.props.url.query.cProps &&
      this.props.url.query.cProps.reqParams.amount
        ? this.props.url.query.cProps.reqParams.amount
        : 1;
    this.props.getReceiverAccountDetails(receiverUsername, receiverAmount);
    // }
  }
  componentWillReceiveProps(nextProps) {
    // console.log("cwrp:", this.props);
    console.log("nextProps:", nextProps);
    if (this.props.senderAccountDetails !== nextProps.senderAccountDetails) {
      this.setState({ senderAccountDetails: nextProps.senderAccountDetails });
    }
    if (
      this.props.receiverAccountDetails !== nextProps.receiverAccountDetails
    ) {
      this.setState({
        receiverAccountDetails: nextProps.receiverAccountDetails
      });
    }
    if (this.props.senderAccountHistory !== nextProps.senderAccountHistory) {
      this.setState({
        senderAccountHistory: nextProps.senderAccountHistory
      });
    }
  }

  handleSecretKey = e => {
    this.setState({ secretKey: e.target.value });
  };

  handleReceiverAmountChange = e => {
    this.setState({
      receiverAccountDetails: {
        ...this.state.receiverAccountDetails,
        receiverAmount: e.target.value
      }
    });
  };

  handleTransaction = () => {
    console.log("in confirm trans");
    this.props.sendPayment(
      this.state.secretKey,
      this.state.receiverAccountDetails.receiverPublicAddress,
      this.state.receiverAccountDetails.receiverAmount
    );
  };

  // handleEnableSignInButton = () =>
  //   this.setState({ enableTransferButton: true });

  handleAccountView = () => {
    console.log("in account view");
    this.props.loaderStart("Getting Account details");
    this.props.getSenderAccountDetails(this.state.secretKey, () =>
      this.setState(state => ({
        transactionStep: 2
      }))
    );
  };

  handleViewAccountHistory = () => {
    console.log("acc his");
    if (
      this.state.senderAccountDetails &&
      this.state.senderAccountDetails.account_id
    ) {
      this.props.getSenderAccountHistory(
        this.state.senderAccountDetails.account_id
      );
    }
  };

  // renderAccountHistory = () => {
  //   if(this.state.senderAccountHistory && this.state.senderAccountHistory.records && this.state.senderAccountHistory.records.length){
  //     this.state.senderAccountHistory.records.map(item => <li>{item.fee_paid} on {item.created_at}</li>);
  //   }
  // };
  renderTransactionSteps = () => {
    switch (this.state.transactionStep) {
      case 0:
        return (
          <button
            onClick={() =>
              this.setState(state => ({
                transactionStep: 1
              }))
            }
            className="btn btn-primary"
          >
            Let me Sign In
          </button>
        );
      case 1:
        return (
          <div>
            <p className="secret-key">
              <span>Secret Key: </span>
              <input
                required
                type="text"
                onChange={this.handleSecretKey}
                value={this.state.secretKey}
                className="form-control text-center"
              />
            </p>
            {this.state.senderAccountDetails &&
            this.state.senderAccountDetails.loginError ? (
              <p className="bg-danger">Wrong secret key. Please try again</p>
            ) : (
              ""
            )}
            <button
              className="btn btn-primary"
              onClick={() => this.handleAccountView()}
              disabled={!this.state.secretKey.length}
              className="btn btn-primary"
            >
              Sign In and Show Balance
            </button>
          </div>
        );
      case 2:
        return (
          <div className="col-xs-12 col-md-offset-2 col-md-8">
            <div className="account-history-wrapper text-center">
              <h4>Account Balance</h4>
              <ul>
                {this.state.senderAccountDetails &&
                  this.state.senderAccountDetails.balances &&
                  this.state.senderAccountDetails.balances.length &&
                  this.state.senderAccountDetails.balances.map(
                    (item, index) => (
                      <li key={index} className="text-info">
                        <div className="balance-list-item">
                          <span className="asset-type">
                            {item.asset_type} :{" "}
                          </span>
                          <span className="item-balance">
                            {item.balance} Lumens
                          </span>
                        </div>
                      </li>
                    )
                  )}
              </ul>
            </div>
            <div className="row">
              <div className="col-xs-12 col-md-12">
                <button
                  onClick={() =>
                    this.setState(
                      state => ({
                        transactionStep: 3
                      }),
                      () => this.handleTransaction()
                    )
                  }
                  className="btn btn-primary"
                >
                  Transfer Now
                </button>
              </div>
              {/* <div className="col-xs-12 col-md-6">
                <button
                  onClick={() =>
                    this.setState(
                      state => ({
                        transactionStep: 1
                      }),
                      () => this.props.clearPaymentandSenderInfo()
                    )
                  }
                  className="btn btn-primary"
                >
                  Back to Login
                </button>
              </div> */}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            {this.props.paymentDetails &&
            this.props.paymentDetails.isPaymentSuccess ? (
              <div>
                <div className="center-block text-center">
                  <img
                    className="img-payment-status"
                    src="/static/success.svg"
                  />
                  <h3>Payment Success.</h3>
                </div>
                <button
                  onClick={() =>
                    this.setState(
                      state => ({
                        transactionStep: 1
                      }),
                      () => this.props.clearPaymentandSenderInfo()
                    )
                  }
                  className="btn btn-primary"
                >
                  Transfer Again
                </button>
              </div>
            ) : this.props.paymentDetails &&
            this.props.paymentDetails.isPaymentSuccess === false ? (
              <div>
                <p>
                  <img className="center-block" src="/static/failed.svg" />Payment
                  Failed
                </p>
                <button
                  onClick={() =>
                    this.setState(
                      state => ({
                        transactionStep: 1
                      }),
                      () => this.props.clearPaymentandSenderInfo()
                    )
                  }
                  className="btn btn-primary"
                >
                  Retry Again
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        );
      default:
        return "default";
    }
  };
  render() {
    return (
      <Layout title="Send/Pay Stellar easily">
        <div className="row">
          <div className="col-xs-12 col-md-offset-3 col-md-6">
            <div className="send-money-card">
              <div className="send-money-card-header">
                <div className="profile-image-container">
                  <div className="profile-header-img current-profile-img" />
                </div>
              </div>
              <div className="send-money-card-body">
                <h3 className="text-center">Send Payment</h3>
                <div>
                  {this.state.receiverAccountDetails.receiverPublicAddress ===
                  "" ? (
                    <p className="receiver-address">
                      <input
                        type="text"
                        placeholder="Enter Receiver Address"
                        defaultValue={
                          this.state.receiverAccountDetails
                            .receiverPublicAddress
                        }
                        className="form-control"
                      />
                    </p>
                  ) : (
                    <p className="receiver-address">
                      <span>Receiver Address: </span>
                      <span>
                        {
                          this.state.receiverAccountDetails
                            .receiverPublicAddress
                        }
                      </span>
                    </p>
                  )}
                  <div className="amount-transfer text-center">
                    <label className="sr-only">Amount to transfer</label>
                    <input
                      type="number"
                      max={this.state.receiverAccountDetails.receiverAmount}
                      value={this.state.receiverAccountDetails.receiverAmount}
                      onChange={this.handleReceiverAmountChange}
                      className="form-control text-center"
                    />
                    <span>
                      {this.state.receiverAccountDetails.receiverAssetType}
                    </span>
                  </div>
                </div>
                {this.renderTransactionSteps()}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getSenderAccountDetails: bindActionCreators(
      getSenderAccountDetails,
      dispatch
    ),
    loaderStart: bindActionCreators(loaderStart, dispatch),
    getSenderAccountHistory: bindActionCreators(
      getSenderAccountHistory,
      dispatch
    ),
    getReceiverAccountDetails: bindActionCreators(
      getReceiverAccountDetails,
      dispatch
    ),
    sendPayment: bindActionCreators(sendPayment, dispatch),
    clearPaymentandSenderInfo: bindActionCreators(
      clearPaymentandSenderInfo,
      dispatch
    )
  };
}
function mapStateToProps(state) {
  return {
    loaderInfo: state.loaderInfo,
    senderAccountDetails: state.senderAccountDetails,
    senderAccountHistory: state.senderAccountHistory,
    receiverAccountDetails: state.receiverAccountDetails,
    paymentDetails: state.paymentDetails
  };
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(
  StellarMe
);
