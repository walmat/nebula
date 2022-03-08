import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet';
import {
  APP_WEBSITE,
  APP_NAME,
  APP_TITLE,
  AUTHOR_EMAIL
} from '../../../constants/meta';
import { openExternalUrl } from '../../../utils/url';
import { resetOverFlowY } from '../../../utils/styleResets';
import { TERMS_OF_SERVICE_TITLE, EFFECTIVE_DATE } from '../../../constants';
import { styles } from './styles';

class TermsOfServicePage extends Component {
  componentWillMount() {
    resetOverFlowY();
  }

  render() {
    const { classes: styles } = this.props;
    return (
      <div className={styles.root}>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>{TERMS_OF_SERVICE_TITLE}</title>
        </Helmet>
        <Typography variant="h5">
          Terms of Service for <span className={styles.bold}>{APP_NAME}</span>
        </Typography>
        <div className={styles.body}>
          <p>
            <span>Effective date: {EFFECTIVE_DATE}</span>
          </p>
          <p>
            <span>
              {APP_NAME} (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;)
              operates the app (hereinafter referred to as the
              &quot;Service&quot;).
            </span>
          </p>
          <p>
            <span>
              Your access to and use of the Service is conditioned on your
              acceptance of and compliance with these Terms. These Terms apply
              to all visitors, users and others who access or use the Service.
            </span>
          </p>
          <p>
            <span>
              By accessing or using the Service you agree to be bound by these
              Terms. If you disagree with any part of the terms then you may not
              access the Service.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>Purchases</strong>
            </span>
          </p>
          <p>
            <span>
              If you wish to purchase any product or service made available
              through the Service (&quot;Purchase&quot;), you may be asked to
              supply certain information relevant to your Purchase including,
              without limitation, your credit card number, the expiration date
              of your credit card, your billing address, and your shipping
              information.
            </span>
          </p>
          <p>
            <span>
              You represent and warrant that: (i) you have the legal right to
              use any credit card(s) or other payment method(s) in connection
              with any Purchase; and that (ii) the information you supply to us
              is true, correct and complete.
            </span>
          </p>
          <p>
            <span>
              The service may employ the use of third party services for the
              purpose of facilitating payment and the completion of Purchases.
              By submitting your information, you grant us the right to provide
              the information to these third parties subject to our Privacy
              Policy.
            </span>
          </p>
          <p>
            <span>
              We reserve the right to refuse or cancel your order at any time
              for certain reasons including but not limited to: product or
              service availability, fraud or an unauthorised or illegal
              transaction is suspected, errors in the description or price of
              the product or service, error in your order or other reasons. You
              expressly agree that Nebula Automation, LLC cannot accept any
              liability for loss or damage arising out of such cancellation.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>
                Availability, Errors and Inaccuracies
              </strong>
            </span>
          </p>
          <p>
            <span>
              We are constantly updating product and service offerings on the
              Service. We may experience delays in updating information on the
              Service and in our advertising on other web sites. The information
              found on the Service may contain errors or inaccuracies and may
              not be complete or current. Products or services may be mispriced,
              described inaccurately, or unavailable on the Service and we
              cannot guarantee the accuracy or completeness of any information
              found on the Service.
            </span>
          </p>
          <p>
            <span>
              We cannot and do not guarantee the accuracy or completeness of any
              information, including prices, product images, specifications,
              availability, and services. We reserve the right to change or
              update information and to correct errors, inaccuracies, or
              omissions at any time without prior notice. Section
              &quot;Availability, Errors and Inaccuracies&quot; is without
              prejudice to existing statutory rights.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>
                Contests, Sweepstakes and Promotions
              </strong>
            </span>
          </p>
          <p>
            <span>
              Any contests, sweepstakes or other promotions (collectively,
              &quot;Promotions&quot;) made available through the Service may be
              governed by rules that are separate from these Terms. If you
              participate in any Promotions, please review the applicable rules
              as well as our Privacy Policy. If the rules for a Promotion
              conflict with these Terms and Conditions, the Promotion rules will
              apply. The terms and conditions of any other
              &quot;Promotions&quot; are independent of this agreement.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>Intellectual Property</strong>
            </span>
          </p>
          <p>
            <span>
              The Service and its original content, features and functionality
              are and will remain the exclusive property of Nebula Automation,
              LLC and its licensors. The Service is protected by copyright,
              trademark, and other laws of both the United States and foreign
              countries. Our trademarks and trade dress may not be used in
              connection with any product or service without the prior written
              consent of Nebula Automation, LLC.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>
                Links To Other Web Sites
              </strong>
            </span>
          </p>
          <p>
            <span>
              Our Service may contain links to third-party web sites or services
              that are not owned or controlled by Nebula Automtion, LLC.
            </span>
          </p>
          <p>
            <span>
              Nebula Automation, LLC has no control over, and assumes no
              responsibility for, the content, privacy policies, or practices of
              any third party web sites or services. You further acknowledge and
              agree that Nebula Automation, LLC shall not be responsible or
              liable, directly or indirectly, for any damage or loss caused or
              alleged to be caused by or in connection with use of or reliance
              on any such content, goods or services available on or through any
              such web sites or services.
            </span>
          </p>
          <p>
            <span>
              We strongly advise you to read the terms and conditions and
              privacy policies of any third-party web sites or services that you
              visit.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>Termination</strong>
            </span>
          </p>
          <p>
            <span>
              We may terminate or suspend your access immediately, without prior
              notice or liability, for any reason whatsoever, including without
              limitation if you breach the Terms.
            </span>
          </p>
          <p>
            <span>
              Upon termination, your right to use the Service will immediately
              cease and all provisions of the Terms which by their nature should
              survive termination shall survive termination, including, without
              limitation, ownership provisions, warranty disclaimers, indemnity
              and limitations of liability.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>Indemnification</strong>
            </span>
          </p>
          <p>
            <span>
              You agree to defend, indemnify and hold harmless Nebula
              Automation, LLC and its licensee and licensors, and their
              employees, contractors, agents, officers and directors, from and
              against any and all claims, damages, obligations, losses,
              liabilities, costs or debt, and expenses (including but not
              limited to attorney&apos;s fees), resulting from or arising out of
              a) your use and access of the Service, or b) a breach of these
              Terms.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>
                Limitation Of Liability
              </strong>
            </span>
          </p>
          <p>
            <span>
              In no event shall Nebula Automation, LLC, nor its directors,
              employees, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential or
              punitive including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from (i) your
              access to or use of or inability to access or use the Service;
              (ii) any conduct or content of any third party on the Service;
              (iii) any content obtained from the Service; and (iv) unauthorized
              access, use or alteration of your transmissions or content,
              whether based on warranty, contract, tort (including negligence)
              or any other legal theory, whether or not we have been informed of
              the possibility of such damage, and even if a remedy set forth
              herein is found to have failed of its essential purpose.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>Disclaimer</strong>
            </span>
          </p>
          <p>
            <span>
              Your use of the Service is at your sole risk. The Service is
              provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
              basis. The Service is provided without warranties of any kind,
              whether express or implied, including, but not limited to, implied
              warranties of merchantability, fitness for a particular purpose,
              non-infringement or course of performance.
            </span>
          </p>
          <p>
            <span>
              Nebula Automation, LLC its subsidiaries, affiliates, and its
              licensors do not warrant that a) the Service will function
              uninterrupted, secure or available at any particular time or
              location; b) any errors or defects will be corrected; c) the
              Service is free of viruses or other harmful components; or d) the
              results of using the Service will meet your requirements.
            </span>
          </p>
          <p>
            <strong className={styles.heading}>
              <span>Exclusions</span>
            </strong>
          </p>
          <p>
            <span>
              Without limiting the generality of the foregoing and
              notwithstanding any other provision of these terms, under no
              circumstances will Nebula Automation, LLC ever be liable to you or
              any other person for any indirect, incidental, consequential,
              special, punitive or exemplary loss or damage arising from,
              connected with, or relating to your use of the Service, these
              Terms, the subject matter of these Terms, the termination of these
              Terms or otherwise, including but not limited to personal injury,
              loss of data, business, markets, savings, income, profits, use,
              production, reputation or goodwill, anticipated or otherwise, or
              economic loss, under any theory of liability (whether in contract,
              tort, strict liability or any other theory or law or equity),
              regardless of any negligence or other fault or wrongdoing
              (including without limitation gross negligence and fundamental
              breach) by Nebula Automation, LLC or any person for whom Nebula
              Automation, LLC is responsible, and even if Nebula Automation, LLC
              has been advised of the possibility of such loss or damage being
              incurred.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>Governing Law</strong>
            </span>
          </p>
          <p>
            <span>
              These Terms shall be governed and construed in accordance with the
              laws of the United States of America and Michigan, without regard
              to its conflict of law provisions.
            </span>
          </p>
          <p>
            <span>
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights. If any provision of
              these Terms is held to be invalid or unenforceable by a court, the
              remaining provisions of these Terms will remain in effect. These
              Terms constitute the entire agreement between us regarding our
              Service, and supersede and replace any prior agreements we might
              have between us regarding the Service.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>Changes</strong>
            </span>
          </p>
          <p>
            <span>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material we will try to
              provide at least 30 days notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion.
            </span>
          </p>
          <p>
            <span>
              By continuing to access or use our Service after those revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, you must stop using the
              service.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>Privacy Policy</strong>
            </span>
          </p>
          <p>
            <span>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </span>
          </p>
          <p>
            <span>
              You agree that they constitute part of these terms. You must read
              our Privacy Policy before you use the Service.
            </span>
          </p>
          <p>
            <span>
              <strong className={styles.heading}>Contact Us</strong>
            </span>
          </p>
          <p>
            <span>
              If you have any questions about these Terms of Service, please
              contact us through&nbsp;
              <a
                onClick={() => {
                  openExternalUrl(APP_WEBSITE);
                }}
              >
                our Twitter
              </a>
              &nbsp;or by&nbsp;
              <a
                onClick={() => {
                  openExternalUrl(`mailto:${AUTHOR_EMAIL}`);
                }}
              >
                email
              </a>
              .
            </span>
          </p>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators({}, dispatch);

const mapStateToProps = (state, props) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TermsOfServicePage));
