# Payment SAAS integration - Technical specifications

## **Version : 1.41**

# Getting started

This documentation describes the integration procedures for Payment SAAS

## [Integration modes](#integration-modes)

## [Payment Methods](#payment-methods)

## [Operations](#operations)

## [Annex](#annex)

## Integration modes

Payments can be achieved by two ways with Payment SAAS : using the
**Hosted Forms**, or the **REST API (server to server)**

- [Hosted Forms](#hosted-forms)

- [REST API (server to
  server)](https://confluence.cdiscount.com/pages/viewpage.action)

- [Iframe Component](#iframe-component)

## Hosted Forms

Hosted Forms allows the merchant to use generic forms from Payment SAAS
to make the payment.

This method must be completed by REST API for back-office operations
like Capture or Refund, as it only creates a payment, do the
Authorization and the 3DS authentication if needed (except if validation
mode is set to auto : in this case, the capture will be done at the same
time)

## Functional details for Hosted Forms

- [Basic Scheme (Hosted
  Forms)](https://confluence.cdiscount.com/pages/viewpage.action)

- [Client redirections](#client-redirections)

- [Notification of the payment
  response](#notification-of-the-payment-response)

- [Merchant Security Key](#merchant-security-key)

- [Calculation of the seal of
  certification](#calculation-of-the-seal-of-certification)

# Basic Scheme (Hosted Forms)

![/staticFiles/media/_1.png](/staticFiles/media/_1.png)

The basic scheme of a payment with Payment SAAS with the hosted forms
follows this routine :

1.  The client selects its desired payment method

2.  The merchant's site redirects the client to the Payment SAAS
    platform

3.  The client writes its payment informations, then, Payment SAAS
    selects a Payment Service Provider (PSP) suitable for the selected
    payment method

4.  If the selected PSP does not respond as expected, Payment SAAS
    selects another PSP among those available for the selected
    payment method

5.  The PSP responds to Payment SAAS

6.  The client is redirected to the return URL of the merchant's site

7.  Payment SAAS notifies the merchant site with the result of the
    payment

# Client redirections

All these informations concern the Front-end calls. See [Test
environments](#test-environments) for more details.

The payment parameters and the order data are grouped in one html sealed
form in order to transmit the payment request to the Payment SAAS server
with the client browser.

**Sample of a redirection form :**

**Redirection Form**

```HTML
<form method="post" name="PaymentForm" action="https://[Front-end URL - See Test environments]">
<input type="hidden" name="version" value="1.0"/>
<input type="hidden" name="merchantID" value="1"/>
<input type="hidden" name="merchantSiteID" value="100"/>
<input type="hidden" name="paymentOptionRef" value="1"/>
<input type="hidden" name="orderRef" value="0907061128WLK0G"/>
<input type="hidden" name="freeText" value=""/>
<input type="hidden" name="decimalPosition" value="2"/>
<input type="hidden" name="currency" value="EUR"/>
<input type="hidden" name="country" value="FR"/>
<input type="hidden" name="invoiceID" value="115224183"/>
<input type="hidden" name="customerRef" value="000000091XLW"/>
<input type="hidden" name="date" value="20090706"/>
<input type="hidden" name="amount" value="15000"/>
<input type="hidden" name="merchantHomeUrl" value="http://www.merchant.com"/>
<input type="hidden" name="merchantBackUrl" value="http://www.merchant.com/order/payment\_choice.aspx">
<input type="hidden" name="merchantReturnUrl" value="http://www.merchant.com/order/payment\_return.aspx">
<input type="hidden" name="merchantNotifyUrl" value="http://www.merchant.com/order/payment\_notify.ashx">
<input type="hidden" name="orderRowsAmount" value="0"/>
<input type="hidden" name="orderFeesAmount" value="0" />
<input type="hidden" name="orderDiscountAmount" value="0" />
<input type="hidden" name="orderShippingCost" value="0" />
<input type="hidden" name="hmac" value="66F36A5FD022B920941F213FAE7AE95E7C97EEB7">
</form>
```

After the processing of the payment request, Payment SAAS redirects the
client to the merchant server, with the given URL provided in the
field *merchantReturnUrl.*

**Sample form sended by Payment SAAS to the return url :**

**Merchant return form**

```HTML
<form method="post" name="PaymentForm" action="[merchantReturnUrl]">
<input type="hidden" name="version" value="1.0"/>
<input type="hidden" name="merchantID" value="1"/>
<input type="hidden" name="merchantSiteID" value="200"/>
<input type="hidden" name="paymentOptionRef" value="1"/>
<input type="hidden" name="orderRef" value="V0907061128WLK0G"/>
<input type="hidden" name="freeText" value="Texte"/>
<input type="hidden" name="country" value="FR"/>
<input type="hidden" name="invoiceID" value="115224183"/>
<input type="hidden" name="customerRef" value="000000091XLW"/>
<input type="hidden" name="date" value="20090706"/>
<input type="hidden" name="amount" value="15000"/>
<input type="hidden" name="decimalPosition" value="2"/>
<input type="hidden" name="currency" value="EUR"/>
<input type="hidden" name="returnCode" value="0"/>
<input type="hidden" name="merchantAccountRef" value="CBCE\@SIPS"/>
<input type="hidden" name="hmac" value="66F36A5FD022B920941F213FAE7AE95E7C97EEB7"/>
</form>
```

# Notification of the payment response

After processing the payment request, in addition to redirecting the
customer to the merchant's site, the payment platform notifies the
merchant of the payment result.

This makes it possible to trace the information without going through
the client's browser.

## Technical details

The notification is done by sending an HTML form in POST mode, to the
address provided by the field *merchantNotifyUrl.*

The information sent is **exactly the same** as the one provided when
redirecting the customer after payment. In the same way, the data is
sealed with an HMAC seal to ensure its integrity and origin.

For more details about the content of the notification, see the section
**Response** for each payment method.

The notification is considered sended when the remote server responds
with an **HTTP 200** code. If this is not the case, the notification
sending is attempted 4 more times, spaced by a short delay.

If the notification never makes its way to the merchant server, it
should not be considered as payed.

# Merchant Security Key

A security key is assigned to each merchant. It is used to certify the
data exchanged between the merchant's server and the secure payment
server.

It is the merchant's responsibility to keep this key securely and
confidentially by using the best tools available in its environment.

The security key is represented by 40 hexadecimal characters (for
example: 0123456789ABCDEF0123456789ABCDEF01234567). This representation
must be converted into a 20-byte string before use.

# Calculation of the seal of certification

In Payment SAAS, the requests and responses are certified by a seal in
order to ensure the integrity of the data. This helps making certain
that the data have not been altered while performing the payment.

## How to calculate the seal ?

The seal (to be put in the hmac field) is calculated using a
cryptographic hash function in combination with a merchant key that
meets the specifications of RFC 2104.

This function will generate the seal from the data to be certified and
the merchant security key in its octal form.

The data to be certified will be presented as a concatenation in a
precise order of the information of the form, splitted by a "**\***"
separator.

**Sample : **

version\*merchantID\*merchantSiteID\*paymentOptionRef\*orderRef\*freeText\*decimalPosition\*currency\*country\*invoiceID\*customerRef\*date\*amount\*merchantHomeUrl\*merchantBackUrl\*merchantReturnUrl\*merchantNotifyUrl\*

Some fields may not be filled in. They are nevertheless taken into
account in the calculation of the seal.

**For example, with an empty freeText field:**

version\*merchantID\*merchantSiteID\*paymentOptionRef\*orderRef**\*\***decimalPosition\*currency\*country\*invoiceID\*customerRef\*date\*amount\*merchantHomeUrl\*merchantBackUrl\*merchantReturnUrl\*merchantNotifyUrl\*

There must be a double "\*" separator, indicating that the field is
present but empty (in red).

Warning when calculating the seal:

- The leading and trailing spaces of each field are deleted (Trim)

- The string of data is encoded in UTF-8

- The order of the query and response fields may be different

## Implementation examples in C\

### Example without UTF-8

Here is a code snippet to calculate the seal adequately in C \#:

```cs
public static string ComputeHMACSHA1(string key, string value)
{
  if (string.IsNullOrEmpty(key))
    throw new ArgumentNullException("key");

  if (string.IsNullOrEmpty(value))
    throw new ArgumentNullException("value");

  if (key.Length % 2 != 0)
    throw new ArgumentException("key must represent an hexadecimal alve");

  // Encode private key into a sequence of bytes

  byte[] keyBytes = new byte[key.Length / 2];

  for (int i = 0; i < keyBytes.Length; i++)
  {
    keyBytes[i] = Convert.ToByte(key.Substring(i \* 2, 2), 16);
  }

  // Encode input value into a sequence of bytes
  UnicodeEncoding UE = new UnicodeEncoding();
  byte[] valueBytes = UE.GetBytes(value);

  // Invoke the HMAC code computer
  HMACSHA1 hashComputer = new HMACSHA1(keyBytes);
  byte[] resultBytes = hashComputer.ComputeHash(valueBytes);

  // Convert the value of each byte of the hash value to its equivalent
  hexadecimal string representation.

  // Remove hyphens between each hexadecimal pair.
  Return BitConverter.ToString(resultBytes).Replace("-", string.Empty);
}

```

### Example with UTF-8

Here is a code snippet to calculate the seal with UTF-8 adequately in C\#:

Warning, if you want to use this method of calculation (with UTF8
encoding), it is necessary to both (Merchant and SAAS) agree on it,
because this algorithm is not activated by default on the platform.

```cs
/// <summary>
/// Computes the HMAC seal from a key and a value, with UFT8 encoding.
/// </summary>
/// <param name="key">The key.</param>
/// <param name="value">The value.</param>
/// <returns>The computed hmac.</returns>

private static string ComputeHMACSHA1_UTF8(string key, string value)
{
  // 1. Converts key and value into byte array.
  byte[] keyBytes = UTF8Encoding.UTF8.GetBytes(key);
  byte[] valueBytes = UTF8Encoding.UTF8.GetBytes(value);

  // 2. Initialize hmac computer
  HMACSHA1 hmacSha1Computer = new HMACSHA1(keyBytes);

  // 3. Performs hash
  byte[] hmacBytes = hmacSha1Computer.ComputeHash(valueBytes);

  // 4. Format the hash into string format.
  return BitConverter.ToString(hmacBytes).Replace("-", string.Empty);

  }
```

# REST API (server to server)

This REST API allows server to server payments, without using the Hosted
Forms. It also allows to make operations like capture or refund on
payments done with Hosted Forms.

All calls made to the REST API must be done with a security token.

## Details on the API

- [Basic Scheme (REST API)](https://confluence.cdiscount.com/pages/viewpage.action)

- [Security Token](#security-token)

- [Available resources](#available-resources)

See [Test environments](#test-environments) for the URLs.

# Basic Scheme (REST API)

![./media/_3.png](/staticFiles/media/_3.png)

The basic scheme of a payment with Payment SAAS with the REST API
follows this routine :

1.  The seller site display a form in order to collect required data
    (card number, expiry date\...)

2.  The client enters its data and clics on "Pay" button

3.  The seller site makes a post request to the REST API

4.  Payment SAAS selects a Payment Service Provider (PSP) suitable for
    the selected payment method

5.  If the selected PSP does not respond as expected, Payment SAAS
    selects another PSP among those available for the selected
    payment method

6.  The PSP responds to Payment SAAS

7.  Payment SAAS send a response to the seller site with result of the
    payment and the returnUrl inside the response

8.  Seller site display the confirmation to the client

# Security Token

All calls made to the REST API must be done with a security token
provided by the Security Token Service (STS) on the resource
**/v1/auth/token**.

The authentication token is mandatory for the others api calls. It
expires after 48h by default.

In order to call the resource, you must have a valid login/password
couple provided by the Payment SAAS team, and give it to the API in
base64 with this format : login:password

# Available resources

The available resources exposed by Payment SAAS's REST API :

- gets available payment options with PaymentOptions resource

- make a payment without 3DSecure with the CardPayment resource

- make a payment with 3DSecure with the Card3DSPayment resource

- make a payment by copying payment data from a previous authorized
  payment with the AuthorByCopyPayment resource

- do an operation on a payment with the Payments resource (capture,
  refund, cancel)

- manage stored payment methods with the StoredPaymentMethods resource
  (add a card for example)

All of these resources are secured by a auth token that you must obtain
using the SecurityToken resource and your credentials.

More details on these resources in the section
[Operations](#operations-1).

# Iframe Component

Another way of using PaymentSaas as payment platform is to use the form
while inside an iframe.

The iframe form is in charge of the same steps as the [hosted
forms](#hosted-forms) but can be displayed inside a frame in the
merchant's page.

![Payment Iframe example](/staticFiles/media/121daffdcb2cca7c6bd049c591096828.png)

Using this method, a few steps are required to complete a payment as
explained below.

## How it works 

![./media/_5.png](/staticFiles/media/_5.png)

The sequence above can be segmented into 4 differents steps:

#### 1 - Initialize Payment Session 

Firstly, you need to call [PaymentSession POST](https://confluence.cdiscount.com/pages/viewpage.action?pageId=78297979)
using the PaymentSaasGateway API.

In order to create a Payment session, you have to provide some
information in regards to the order, the customer and some configuration
about your site.

For example, one of the parameters called **formType** has to be set to
"**iframe**".

Once you have sent the request, you will receive a response with a
session Id and a session URL. Both are necessary to generate the iframe
during the next step.

####

#### 2 - Generate Iframe

Once your session has been created you can use it to generate an iframe.
This can be achieved with the javascript bundle available
here <https://payment.cdiscount.com/dist/js/paymentHub.bundle.js.>

For homologation tests
here [https://payment.recette-cdiscount.com/dist/js/paymentHub.bundle.js](https://payment.recette-cdiscount.com/dist/js/paymentHub.bundle.js.).

**After the merchant's domain passes the authorization check**, the
js displays an iframe with a payment form inside:

![./media/_6.png](/staticFiles/media/d5462136b816e8dd386a2b8f943d49f0.png)

#### 3 - Payment Process

All the payment process happens inside the iframe. The customer enters
payment data and submits the form.

The merchant page has no access to the data and is only notified once
the payment has finished.

The merchant page will be notified by a call to the method the merchant
has provided to the bundled js.

#### 4 - Check Payment status

Finally, after being notified the merchant can check on the payment's
current status.

Simply use the
[GetPaymentSession](https://confluence.cdiscount.com/pages/viewpage.action?pageId=78297983) that
returns a responseCode and a complementaryResponseCode detailing whether
the payment has been authorized or not.

## How to include the Iframe inside your page 

#### Import PaymentHub bundle

You will have to import our js bundle on your page. The code might
differ depending on the language you're using (ASP, PHP, React). For
basic HTML usage:

```HTML
<script type="text/javascript" src="https://payment.recette-cdiscount.com/dist/js/paymentHub.js"></script>
```

OR for production, the minified version :

```HTML
<script type="text/javascript" src="https://payment.recette-cdiscount.com/dist/js/paymentHub.min.js"></script>
```

**Insert the iframe**

To insert an iframe into your page, you have to add an element inside
your page that will nest the iframe.

```HTML
<div id="chosenDiv" style="width: 400px; height: 500px;
border-color: gray; border-width: 4px; display: inline-block;">

</div>
```

#### Initializing the iframe

To initialize the iframe using the element that you have added, you need
to create 2 functions (load and notify). Your js could end up looking
like the following:

```HTML
<script type="text/javascript">
  // do here what you want to do once payment is finished
  function onPaymentCompleted() {
    alert('payment is completed');
  }

  //function to display the payment iframe

  function loadPaymentIframe() {
    var hubOptions =  {
          paymentSessionId: 'createdSessionId',
          paymentSessionUrl: 'createdSessionUrl',
          placeHolderSelector: '\#chosenDiv',
          paymentCompleted: onPaymentCompleted,
          style : { height: '350px', maxWidth: '500px'}
    };

    // PaymentHub.IframeComponent is referenced in the bundle
    var iframeComponent = new PaymentHub.IframeComponent(hubOptions);
    iframeComponent.init();
  }

</script>
```

The fields that need to be provided to the hub as options are :

| Field               | Description                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| PaymentSessionId    | Payment Session identifier                                                                                                 |
| PaymentSessionUrl   | Payment Session Url                                                                                                        |
| PlaceHolderSelector | The Html element inside which the iframe should be displayed (here it's the element which id is 'chosenDiv')               |
| Style               | At the moment, this field can only contain height and maxwidth style elements that will be applied to the displayed iframe |

# Payment Methods

Here is a list of available payment methods of the Payment SAAS
platform, each with specific details.

# Bank Card payment

This section deals with bank card payments like CB, VISA, or MASTERCARD.
A payment request can be mono-order or multi-order (with multiple
merchants as in the Marketplace).

The Bank Card payment method includes the payment with 3D Secure
authentication process.

## Supported operations

These operations are available on the resource "_Payments_" on the
REST API

- [Authorize](#authorize-1) (Either with Hosted Forms, or REST API)

- [Capture](#capture-1)

- [Cancel or Refund](#cancel-or-refund-1)

- [Get details](#get-details-1)

## Supported options

- 3D-Secure

- Splitted payment

## Implementation details

### (Hosted Forms)

Check the specific implementation details in the following sections :

- [Hosted Forms - Bank Card](#hosted-forms---bank-card)

### (Rest API)

Check the specific implementation details in the following sections :

- [REST API - Bank Card](#rest-api---bank-card)

# Hosted Forms - Bank Card

To achieve a 3D-Secure payment, just specify in the call the matching
PaymentOptionRef.

See specific details for mono and multi order in the following :

- [Mono-Order](#mono-order)

- [Multi-Order](#multi-order)

# Mono-Order

This is the simpliest scenario: a Bank Card payment with only one order.

This section will present all the fields of the payment request and
response, and their function.

All these informations concerns the Front-end calls. See [Test
environments](#test-environments) for more details.

A more detailed data dictionnary (with data types) is available here:
[Data dictionary](#data-dictionary)

## Request

| Field                                | Required ?                                   | Must be signed ?                             | Description                                                                              |
| ------------------------------------ | -------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| version                              | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Version of the payment platform                                                          |
| merchandID                           | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Merchant identifier                                                                      |
| merchantSiteID                       | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Merchant's site identifier                                                               |
| paymentOptionRef                     | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Payment method identifier selected by the customer, as described by the merchant         |
| orderRef                             | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Reference of the order at the merchant                                                   |
| orderTag**¹**                        |                                              | **only if present**                          | Tag of the order                                                                         |
| freeText                             |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Free text                                                                                |
| decimalPosition                      | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Position of the decimal separator                                                        |
| currency                             | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Currency of the order (Ex : EUR)                                                         |
| country                              | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Country code (Ex: FR)                                                                    |
| culture**¹**                         |                                              | **only if present**                          | Culture name (Ex : fr-FR, en-US, es-CO, es-PA)                                           |
| invoiceID                            |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Invoice identifier                                                                       |
| customerRef                          | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Reference of the customer at the merchant                                                |
| date                                 | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Date of the order                                                                        |
| amount                               | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Total amount with taxes of the order                                                     |
| orderRowsAmount                      |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Total amount with taxes of the rows of the order                                         |
| orderFeesAmount                      |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Total amount of the fees associated with the order                                       |
| orderDiscountAmount                  |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Total amount of the discounts associated with the order                                  |
| orderShippingCost                    |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Total amount of the shipping costs associated with the order                             |
| allowCardStorage**¹**                |                                              | **only if present**                          | Indicator allowing the storage of the used card                                          |
| forceUserCardStorage**¹**            |                                              | **only if present**                          | Indicator allowing to force the storage of the customer's bank card without asking       |
| passwordRequired**¹**                |                                              | **only if present**                          | Customer Password Request Indicator                                                      |
| forceImmediateStoredCardPayment**¹** |                                              | **only if present**                          | Force a payment with stored card (the first card given will be used)                     |
| merchantAuthenticateUrl**¹**         |                                              | **only if present**                          | URL to which will be verified the password of the customer at the merchant               |
| storedCardID1..n**¹**                |                                              | **only if present**                          | List of stored card identifiers to offer for payment                                     |
| storedCardLabel1..n**¹**             |                                              | **only if present**                          | List of stored card names to offer for payment                                           |
| merchantHomeUrl                      | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | URL of the home page of the merchant site                                                |
| merchantBackUrl                      |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | URL of the previous page (like "basket") of the merchant site                            |
| merchantReturnUrl                    | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | URL where the customer returns to the merchant site after the payment has been processed |
| merchantNotifyUrl                    | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | URL by which the payment platform notifies the merchant site of the payment result       |
| payFormType**¹**                     |                                              | **only if present**                          | Type of the form                                                                         |
| hmac                                 | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Seal issued from the data certification                                                  |

**¹** : The presence of these parameters is not required. Therefore,
there is no need to certify those data if absent.

**NB :** The settings for payment recognition are not used as part of a
3-D Secure payment.

-## Response

| **Field**                    | **Required ?**                               | **Must be signed ?**                         | **Description**                                                                                       |
| ---------------------------- | -------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| version                      | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Version of the payment platform                                                                       |
| merchandID                   | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Merchant identifier                                                                                   |
| merchantSiteID               | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Merchant's site identifier                                                                            |
| paymentOptionRef             | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Payment method identifier selected by the customer, as described by the merchant                      |
| orderRef                     | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Reference of the order at the merchant                                                                |
| orderTag**¹**                |                                              | **only if present**                          | Tag of the order                                                                                      |
| freeText                     |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Free text                                                                                             |
| decimalPosition              | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Position of the decimal separator                                                                     |
| currency                     | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Currency of the order (Ex : EUR)                                                                      |
| country                      | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Country code (Ex: FR)                                                                                 |
| invoiceID                    |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Invoice identifier                                                                                    |
| customerRef                  | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Reference of the customer at the merchant                                                             |
| date                         | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Date of the order                                                                                     |
| amount                       | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Total amount with taxes of the order                                                                  |
| returnCode                   | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Result code of the payment                                                                            |
| complementaryReturnCode**¹** |                                              | **only if present**                          | Complementary result code of the payment (for your information)                                       |
| merchantAccountRef           |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Identifer of the Distance selling contract used for the payment, as described by the merchant         |
| scheduleDate1..n             |                                              | **only if present**                          | Date of payment of the schedule (splitted payment only)                                               |
| scheduleAmount1..n           |                                              | **only if present**                          | Amount of the schedule (splitted payment only)                                                        |
| uniqueTransactionId**¹**     |                                              | **only if present**                          | Unique identifier for the transaction. The field is sended only for litigation, and only if activated |
| storedCardID**¹**            |                                              | **only if present**                          | Identifier of the stored card created                                                                 |
| storedCardLabel**¹**         |                                              | **only if present**                          | Name of the stored card created                                                                       |
| hmac                         | ![./media/_7.png](/staticFiles/media/_7.png) |                                              | Seal issued from the data certification                                                               |

**¹** : The presence of these parameters is not required. Therefore,
there is no need to certify those data if absent

## Data to certify

As stated in the [Integration modes](#integration-modes-1), the requests
and responses are certified by a seal in order to ensure the integrity
of the data.

|                          | **Request**                                                              | **Response**                                                    |
| ------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| **Data to certify**      | version\*                                                                | version\*                                                       |
|                          | merchantID\*                                                             | merchantID\*                                                    |
| ** (without new line) ** | merchantSiteID\*                                                         | merchantSiteID\*                                                |
|                          | paymentOptionRef\*                                                       | paymentOptionRef\*                                              |
|                          | orderRef\*                                                               | orderRef\*                                                      |
|                          | orderTag\*                                                               | orderTag\*                                                      |
|                          | freeText\*                                                               | freeText\*                                                      |
|                          | decimalPosition\*                                                        | decimalPosition\*                                               |
|                          | currency\*                                                               | currency\*                                                      |
|                          | country\*                                                                | country\*                                                       |
|                          | culture\*                                                                | invoiceID\*                                                     |
|                          | invoiceID\*                                                              | customerRef\*                                                   |
|                          | customerRef\*                                                            | date\*                                                          |
|                          | date\*                                                                   | amount\*                                                        |
|                          | amount\*                                                                 | returnCode\*                                                    |
|                          | orderRowsAmount\*                                                        | merchantAccountRef\*                                            |
|                          | orderFeesAmount\*                                                        | [scheduleDate1*scheduleAmount1*scheduleDateN*scheduleAmountN*]] |
|                          | orderDiscountAmount\*                                                    | storedCardID\*                                                  |
|                          | orderShippingCost\*                                                      | storedCardLabel\*                                               |
|                          | allowCardStorage\*                                                       |                                                                 |
|                          | passwordRequired\*                                                       |                                                                 |
|                          | forceImmediateStoredC                                                    |                                                                 |
|                          | ardPayment\*                                                             |                                                                 |
|                          | merchantAuthenticateUrl\*                                                |                                                                 |
|                          | [storedCardID1\*storedCardLabel1\*[storedCardIDN\*storedCardLabelN\*]]\  |                                                                 |
|                          | merchantHomeUrl\*                                                        |                                                                 |
|                          | merchantBackUrl\*                                                        |                                                                 |
|                          | merchantReturnUrl\*                                                      |                                                                 |
|                          | merchantNotifyUrl\*                                                      |                                                                 |

## Samples of Request and Response

### Request sample

Here is a minimal sample for a bank card payment request :

**Request Sample**

```HTML
<form method="post" name="PaymentForm" action="https://[Front-endURL - See Test environments]">
  <input type="hidden" name="version" value="1.0"/>
  <input type="hidden" name="merchantID" value="33"/>
  <input type="hidden" name="merchantSiteID" value="99002"/>
  <input type="hidden" name="paymentOptionRef" value="1"/>
  <input type="hidden" name="orderRef" value="20190131_HostedFormTest001"/>
  <input type="hidden" name="freeText" value=""/>
  <input type="hidden" name="decimalPosition" value="2"/>
  <input type="hidden" name="currency" value="EUR"/>
  <input type="hidden" name="country" value="FR"/>
  <input type="hidden" name="invoiceID" value="123456789"/>
  <input type="hidden" name="customerRef" value="000000001LKF"/>
  <input type="hidden" name="date" value="20190131"/>
  <input type="hidden" name="amount" value="123"/>
  <input type="hidden" name="orderRowsAmount" value="123"/>
  <input type="hidden" name="orderFeesAmount" value="0"/>
  <input type="hidden" name="orderDiscountAmount" value="0"/>
  <input type="hidden" name="orderShippingCost" value="0"/>
  <input type="hidden" name="merchantHomeUrl" value="http://www.merchant.com"/>
  <input type="hidden" name="merchantBackUrl" value="http://www.merchant.com/back"/>
  <input type="hidden" name="merchantReturnUrl" value="http://www.merchant.com/return"/>
  <input type="hidden" name="merchantNotifyUrl" value="http://www.merchant.com/notify"/>
  <input type="hidden" name="hmac" value="56BBB83445B9B1C9BECA958E47CD1BC06B876062"/>
</form>
```

For this request, the data to certify would be :

| **Data to certify** |                                                                                                                                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Template**        | version\*merchantID\*merchantSiteID\*paymentOptionRef\*orderRef\*freeText\*decimalPosition\*currency\*country\*invoiceID\*customerRef\*date\*amount\*orderRowsAmount\*orderFeesAmount\*orderDiscountAmount\*orderShippingCost\*merchantHomeUrl\*merchantBackUrl\*merchantReturnUrl\*merchantNotifyUrl\* |
| **Request sample**  | 1.0\*33\*99002\*1\*20190131_HostedFormTest001\*\*2\*EUR\*FR\*123456789\*000000001LKF\*20190131\*123\*123\*0\*0\*0\*http://www.merchant.com\*http://www.merchant.com/back\*http://www.merchant.com/return\*http://www.merchant.com/notify\*                                                              |

> In this exemple, the minimal list of mandatory fields are presents.\
> All fields marked as "only if present" in the column "must be signed
> ?" must NOT be included into the seal.
>
> For example, "culture" and "forceImmediateStoredCardPayment" are not
> certified because they are absent from the request.

### Response sample

Here is a minimal response which will be POST-ed on the
"merchantReturnUrl"  :

**Response Sample**

```HTML
<form method="post" name="PaymentForm" action="[merchantReturnUrl]">
  <input type="hidden" name="version" value="1.0"/>
  <input type="hidden" name="merchantID" value="33"/>
  <input type="hidden" name="merchantSiteID" value="99003"/>
  <input type="hidden" name="paymentOptionRef" value="1"/>
  <input type="hidden" name="orderRef" value="20190131_HostedFormTest102"/>
  <input type="hidden" name="freeText" value=""/>
  <input type="hidden" name="decimalPosition" value="2"/>
  <input type="hidden" name="currency" value="EUR"/>
  <input type="hidden" name="country" value="FR"/>
  <input type="hidden" name="invoiceID" value="123456789"/>
  <input type="hidden" name="customerRef" value="000000001LKF"/>
  <input type="hidden" name="date" value="20190131"/>
  <input type="hidden" name="amount" value="123"/>
  <input type="hidden" name="returnCode" value="0"/>
  <input type="hidden" name="merchantAccountRef" value="CBBNP\@PAYLINE"/>
  <input type="hidden" name="cardType" value="VISA"/>
  <input type="hidden" name="cardSubType" value="Gold"/>
  <input type="hidden" name="hmac" value="A7A6394D2B18DE48E4A4BE3A4AD975A68E15766D"/>
</form>
```

For this response, the data to certify would be :

|                     | **Template**                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Data to certify** | version\*merchantID\*merchantSiteID\*paymentOptionRef\*orderRef\*freeText\*decimalPosition\*currency\*country\*invoiceID\*customerRef\*date\*amount\*returnCode\*merchantAccountRef\* |
| **Response Sample** | 1.0\*33\*99003\*1\*20190131_HostedFormTest102\*\*2\*EUR\*FR\*123456789\*000000001LKF\*20190131\*123\*0\*CBBNP\@PAYLINE\*                                                              |

# Multi-Order

This scenario presents a Bank Card payment with sub-orders. This is
useful for instance in case of a Marketplace: several articles sold by
different merchants in the same order.

This section will present all the fields of the payment request and
response, and their function.

> All these informations concerns the Front-end calls. See [Test environments](#test-environments) for more details.

> A more detailed data dictionary (with data types) is available here: [Data dictionary](#data-dictionary)

## Request

| **Field**                            | **Required ?**                               | **Must be signed**                                            | **Description**                                                                          |
| ------------------------------------ | -------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| version                              | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Version of the payment platform                                                          |
| merchandID                           | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Merchant identifier                                                                      |
| merchantSiteID                       | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Merchant's site identifier                                                               |
| paymentOptionRef                     | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Payment method identifier selected by the customer, as described by the merchant         |
| orderRef                             | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Reference of the order at the merchant                                                   |
| orderTag**¹**                        |                                              | **only if present**                                           | Tag of the order                                                                         |
| freeText                             |                                              | ![./media/_7.png](/staticFiles/media/_7.png)                  | Free text                                                                                |
| decimalPosition                      | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Position of the decimal separator                                                        |
| currency                             | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Currency of the order (Ex : EUR)                                                         |
| country                              | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Country code (Ex: FR)                                                                    |
| culture**¹**                         |                                              | **only if present**                                           | Culture name (Ex : fr-FR, en-US, es-CO, es-PA)                                           |
| invoiceID                            |                                              | ![./media/_7.png](/staticFiles/media/_7.png)                  | Invoice identifier                                                                       |
| customerRef                          | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Reference of the customer at the merchant                                                |
| date                                 | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Date of the order                                                                        |
| amount                               | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Total amount with taxes of the order                                                     |
| orderRowsAmount                      |                                              | ![./media/_7.png](/staticFiles/media/_7.png)                  | Total amount with taxes of the rows of the order                                         |
| orderFeesAmount                      |                                              | ![./media/_7.png](/staticFiles/media/_7.png)                  | Total amount of the fees associated with the order                                       |
| orderDiscountAmount                  |                                              | ![./media/_7.png](/staticFiles/media/_7.png)                  | Total amount of the discounts associated with the order                                  |
| orderShippingCost                    |                                              | ![./media/_7.png](/staticFiles/media/_7.png)                  | Total amount of the shipping costs associated with the order                             |
| allowCardStorage**¹**                |                                              | **only if present**                                           | Indicator allowing the storage of the used card                                          |
| forceUserCardStorage**¹**            |                                              | **only if present**                                           | Indicator allowing to force the storage of the customer's bank card without asking       |
| passwordRequired**¹**                |                                              | **only if present**                                           | Customer Password Request Indicator                                                      |
| forceImmediateStoredCardPayment**¹** |                                              | **only if present**                                           | Force a payment with stored card (the first card given will be used)                     |
| merchantAuthenticateUrl**¹**         |                                              | **only if present**                                           | URL to which will be verified the password of the customer at the merchant               |
| storedCardID1..n**¹**                |                                              | **only if present**                                           | List of stored card identifiers to offer for payment                                     |
| storedCardLabel1..n**¹**             |                                              | **only if present**                                           | List of stored card names to offer for payment                                           |
| merchantHomeUrl                      | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | URL of the home page of the merchant site                                                |
| merchantBackUrl                      | ![./media/_7.png](/staticFiles/media/_7.png) | URL of the previous page (like "basket") of the merchant site |
| merchantReturnUrl                    | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | URL where the customer returns to the merchant site after the payment has been processed |
| merchantNotifyUrl                    | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | URL by which the payment platform notifies the merchant site of the payment result       |
| orderRef1..n                         | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | References of each sub-orders                                                            |
| amount1..n                           | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Amount with taxes of each sub-orders                                                     |
| invoiceID1..n**¹**                   |                                              | **only if present**                                           | Invoice of each sub-orders                                                               |
| payFormType**¹**                     |                                              | **only if present**                                           | Type of the form                                                                         |
| hmac                                 | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png)                  | Seal issued from the data certification                                                  |

> **¹** : The presence of these parameters is not required. Therefore, there is no need to certify those data if absent.

## Response

| **Field**                      | **Required ?**                               | **Must be signed ?**                         | **Description**                                                                                       |
| ------------------------------ | -------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| version                        | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Version of the payment platform                                                                       |
| merchandID                     | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Merchant identifier                                                                                   |
| merchantSiteID                 | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Merchant's site identifier                                                                            |
| paymentOptionRef               | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Payment method identifier selected by the customer, as described by the merchant                      |
| orderRef                       | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Reference of the order at the merchant                                                                |
| orderTag**¹**                  |                                              | **only if present**                          | Tag of the order                                                                                      |
| freeText                       |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Free text                                                                                             |
| decimalPosition                | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Position of the decimal separator                                                                     |
| currency                       | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Currency of the order (Ex : EUR)                                                                      |
| country                        | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Country code (Ex: FR)                                                                                 |
| invoiceID                      |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Invoice identifier                                                                                    |
| customerRef                    | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Reference of the customer at the merchant                                                             |
| date                           | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Date of the order                                                                                     |
| amount                         | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Total amount with taxes of the order                                                                  |
| orderRef1..n                   | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | References of each sub-orders                                                                         |
| amount1..n                     | ![./media/_7.png](/staticFiles/media/_7.png) | ![./media/_7.png](/staticFiles/media/_7.png) | Amount with taxes of each sub-orders                                                                  |
| invoiceID1..n**¹**             |                                              | **only if present**                          | Invoice of each sub-orders                                                                            |
| returnCode1..n**¹**            | ![./media/_7.png](/staticFiles/media/_7.png) | **only if present**                          | Result code of the payment                                                                            |
| complementaryReturnCode1..n    |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Complementary result code of the payment (for your information)                                       |
| merchantAccountRef1..n         |                                              | ![./media/_7.png](/staticFiles/media/_7.png) | Identifer of the Distance selling contract used for the payment, as described by the merchant         |
| storedCardID**¹**              |                                              | **only if present**                          | Identifier of the stored card created                                                                 |
| storedCardLabel**¹**           |                                              | **only if present**                          | Name of the stored card created                                                                       |
| orderRef1..nScheduleDate1..n   |                                              | ![./media/_7.png](/staticFiles/media/_7.png) |                                                                                                       |
| orderRef1..nScheduleAmount1..n |                                              | ![./media/_7.png](/staticFiles/media/_7.png) |                                                                                                       |
| uniqueTransactionId1..n**¹**   |                                              | **only if present**                          | Unique identifier for the transaction. The field is sended only for litigation, and only if activated |
| hmac                           | ![./media/_7.png](/staticFiles/media/_7.png) |                                              | Seal issued from the data certification                                                               |

> **¹** : The presence of these parameters is not required. Therefore, there is no need to certify those data if absent.

## Data to certify

As stated in the [Integration modes](#integration-modes-1), the requests
and responses are certified by a seal in order to ensure the integrity
of the data.

|                     | **Request**           | **Response**          |
| ------------------- | --------------------- | --------------------- |
| **Data to certify** | version\*             | version\*             |
|                     | merchantID\*          | merchantID\*          |
|                     | merchantSiteID\*      | merchantSiteID\*      |
|                     | paymentOptionRef\*    | paymentOptionRef\*    |
|                     | orderRef\*            | orderRef\*            |
|                     | orderTag\*            | orderTag\*            |
|                     | freeText\*            | freeText\*            |
|                     | decimalPosition\*     | decimalPosition\*     |
|                     | currency\*            | currency\*            |
|                     | country\*             | country\*             |
|                     |                       | invoiceID\*           |
|                     | culture\*             | customerRef\*         |
|                     | invoiceID\*           | date\*                |
|                     | customerRef\*         | amount\*              |
|                     | date\*                | orderRef1\*           |
|                     | amount\*              | amount1\*             |
|                     | orderRowsAmount\*     | returnCode1\*         |
|                     | orderFeesAmount\*     | merchantAccountRef1\* |
|                     | orderDiscountAmount\* | \                     |
|                     | \                     | [orderRefN\*          |
|                     | orderShippingCost\*   | amountN\*             |
|                     |                       | returnCodeN\*         |
|                     | allowCardStorage\*    | merchantAccountRefN\* |
|                     |                       | ]                     |
|                     | passwordRequired\*    |                       |
|                     |                       | storedCardID\*        |
|                     | forceImmediateStoredC |                       |
|                     | ardPayment\*          | storedCardLabel\*     |
|                     |                       |                       |
|                     | merchantAuthenticateU |                       |
|                     | rl\*                  |                       |
|                     |                       |                       |
|                     | storedCardID1\*       |                       |
|                     |                       |                       |
|                     | storedCardLabel1\*    |                       |
|                     |                       |                       |
|                     | [storedCardIDN\*      |                       |
|                     |                       |                       |
|                     | storedCardLabelN\*]   |                       |
|                     |                       |                       |
|                     | merchantHomeUrl\*     |                       |
|                     | merchantBackUrl\*     |                       |
|                     | merchantReturnUrl\*   |                       |
|                     | merchantNotifyUrl\*   |                       |
|                     | orderRef1\*           |                       |
|                     | amount1\*             |                       |
|                     |                       |                       |
|                     | invoiceID1\*          |                       |
|                     | [orderRefN\*amountN\  |                       |
|                     | \*                    |                       |
|                     | invoiceIDN\*]         |                       |

## Samples of Request and Response

### Request sample

Here is a minimal sample for a multi-order bank card payment request,
with two sub-orders:

```HTML
<form method="post" name="PaymentForm" action="https://[Front-endURL - See Test environments]">
  <input type="hidden" name="version" value="1.0"/>
  <input type="hidden" name="merchantID" value="33"/>
  <input type="hidden" name="merchantSiteID" value="99002"/>
  <input type="hidden" name="paymentOptionRef" value="1"/>
  <input type="hidden" name="orderRef" value="20190201_HostedFormTest001"/>
  <input type="hidden" name="freeText" value=""/>
  <input type="hidden" name="decimalPosition" value="2"/>
  <input type="hidden" name="currency" value="EUR"/>
  <input type="hidden" name="country" value="FR"/>
  <input type="hidden" name="invoiceID" value="123456789"/>
  <input type="hidden" name="customerRef" value="000000001LKF"/>
  <input type="hidden" name="date" value="20190201"/>
  <input type="hidden" name="amount" value="15000"/>
  <input type="hidden" name="orderRowsAmount" value="15000"/>
  <input type="hidden" name="orderFeesAmount" value="0"/>
  <input type="hidden" name="orderDiscountAmount" value="0"/>
  <input type="hidden" name="orderShippingCost" value="0"/>
  <input type="hidden" name="merchantHomeUrl" value="http://www.merchant.com"/>
  <input type="hidden" name="merchantBackUrl" value="http://www.merchant.com/back"/>
  <input type="hidden" name="merchantReturnUrl" value="http://www.merchant.com/return"/>
  <input type="hidden" name="merchantNotifyUrl" value="http://www.merchant.com/notify"/>
  <input type="hidden" name="orderRef1" value="20190201_HostedFormTest_sub1"/>
  <input type="hidden" name="amount1" value="10000"/>
  <input type="hidden" name="invoiceID1" value="123456"/>
  <input type="hidden" name="orderRef2" value="20190201_HostedFormTest_sub2"/>
  <input type="hidden" name="amount2" value="5000"/>
  <input type="hidden" name="invoiceID2" value="654321"/>
  <input type="hidden" name="hmac" value="9B071E5D5575D9FEBD87BD39C19FEE0C8A23E142"/>
</form>
```

For this request, the data to certify would be:

|                     | **Template**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Data to certify** | version\*merchantID\*merchantSiteID\*paymentOptionRef\*orderRef\*freeText\*decimalPosition\*currency\*country\*culture\*invoiceID\*customerRef\*date\*amount\*orderRowsAmount\*orderFeesAmount\*orderDiscountAmount\*orderShippingCost\*merchantHomeUrl\*merchantBackUrl\*merchantReturnUrl\*merchantNotifyUrl\*orderRef1\*amount1\*invoiceID1\*[orderRef*N*\*amount*N*\*invoiceID*N*\*]                                                                                                                                                                      |
| **Request sample**  | 1.0\*33\*99002\*1\*20190201_HostedFormTest001\**2\*EUR\*FR\*123456789\*000000001LKF\*20190201\*15000\*15000\*0\*0\*0\*[[http://www.merchant.com\*http://www.merchant.com/back\*http://www.merchant.com/return\*http://www.merchant.com/notify\*20190201_HostedFormTest_sub1\*10000\*123456\*20190201_HostedFormTest_sub2\*5000\*654321\*]{.underline}](http://www.merchant.com*http//www.merchant.com/back*http://www.merchant.com/return*http://www.merchant.com/notify*20190201_HostedFormTest_sub1*10000*123456*20190201_HostedFormTest_sub2*5000*654321*) |

> In this exemple, the minimal list of mandatory fields are presents.\
> All fields marked as "only if present" in the column "must be signed?" must NOT be included into the seal.
>
> For example, "culture" and "forceImmediateStoredCardPayment" are not certified because they are absent from the request.

### Response sample

Here is a minimal response example :

```HTML
<form method="post" name="PaymentForm" action="[merchantReturnUrl]">
  <input type="hidden" name="version" value="1.0"/>
  <input type="hidden" name="merchantID" value="33"/>
  <input type="hidden" name="merchantSiteID" value="99003"/>
  <input type="hidden" name="paymentOptionRef" value="1"/>
  <input type="hidden" name="orderRef" value="20190201_HostedFormTest996"/>
  <input type="hidden" name="freeText" value=""/>
  <input type="hidden" name="decimalPosition" value="2"/>
  <input type="hidden" name="currency" value="EUR"/>
  <input type="hidden" name="country" value="FR"/>
  <input type="hidden" name="invoiceID" value="123456789"/>
  <input type="hidden" name="customerRef" value="000000001LKF"/>
  <input type="hidden" name="date" value="20190201"/>
  <input type="hidden" name="amount" value="15000"/>
  <input type="hidden" name="orderRef1"   value="20190201_HostedFormTest996_1"/>
  <input type="hidden" name="amount1" value="10000"/>
  <input type="hidden" name="invoiceID1" value="123456"/>
  <input type="hidden" name="returnCode1" value="0"/>
  <input type="hidden" name="merchantAccountRef1" value="CBBNP\@PAYLINE"/>
  <input type="hidden" name="orderRef2" value="20190201_HostedFormTest996_2"/>
  <input type="hidden" name="amount2" value="5000"/>
  <input type="hidden" name="invoiceID2" value="654321"/>
  <input type="hidden" name="returnCode2" value="0"/>
  <input type="hidden" name="merchantAccountRef2"  value="CBBNP\@PAYLINE"/>
  <input type="hidden" name="hmac"  value="53D29A01D85121F64323AC5DF0F49779797AE4EB"/>
</form>
```

For this response, the data to certify would be:

|                     | **Template**                                                                                                                                                                                                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Data to certify** | version\*merchantID\*merchantSiteID\*paymentOptionRef\*orderRef\*freeText\*decimalPosition\*currency\*country\*invoiceID\*customerRef\*date\*amount\*orderRef1\*amount1\*invoiceID1\*returnCode1\*merchantAccountRef1\*orderRef*N*\*amount*N*\*invoiceID*N*\*returnCode*N*\*merchantAccountRef*N*\*] |
| **Response sample** | 1.0\*33\*99003\*1\*20190201_HostedFormTest996\*\*2\*EUR\*FR\*123456789\*000000001LKF\*20190201\*15000\*20190201_HostedFormTest996_1\*10000\*0\*CBBNP\@PAYLINE\*20190201_HostedFormTest996_2\*5000\*0\*CBBNP\@PAYLINE\*                                                                               |

# REST API - Bank Card

In REST API integration mode, there is no "multi-order" specific
intelligence. If you want to achieve a multi-order payment, just create
a new payment each time needed.

# Without 3D-Secure

In order to achieve a simple Bank Card payment, you need to use the
resource **CardPayment **available on **/v1/payments/card-payment**.

API Contract is detailled in the [Authorize](#authorize-1) section.

More details on the OpenAPI specification (see [Test
environments](#test-environments)).

# With 3D-Secure

In order to achieve a Bank Card payment with 3D-Secure, you need to use
the resource **Card3DSPayment** available on
**/v1/payments/card3ds-payment**.

In this specific case, two calls are needed :

- CheckEnrollement, which is done by a POST on the resource, and make
  the 3D-Secure authentication

- Authorize, which is done by a PUT on the resource with the order
  reference and the paymentRequestId returned from the POST.

API Contract is detailled in the [Authorize](#authorize-1) section.

More details on the OpenAPI specification (see [Test
environments](#test-environments)).

# Stored card Payment

In order to achieve a payment with a stored card, you need to create or
retrieve it with the resource **StoredPaymentMethod** available on
**/v1/payments/stored-payment-method**.

You can either get the stored card, create it or delete it, regarding
the method used (GET, POST or DELETE)

More details on the OpenAPI specification (see [Test
environments](#test-environments)).

# Operations

Here is a list of available operations on the Payment SAAS plateform, on
the **REST API**, with details regarding each one of it.

Every operation returns a **returncode** and a **message** for
additionnal informations. The **order reference (OrderRef)** acts as an
unique ID for later usage (capture, cancel, refund\...)

> In case of a success, the return code is always **0**. Any other return code indicates a refusal

# Available operations

> All these operations are available on the REST API. See [Test environments](#test-environments) for more details.

## [Authorize](#authorize)

## [Capture](#capture)

## [Cancel or Refund](#cancel-or-refund-

## [Get details](#get-details)

## [[POST] /PaymentSession](https://confluence.cdiscount.com/pages/viewpage.action)

## [[GET] /PaymentSession](https://confluence.cdiscount.com/pages/viewpage.action)

# Authorize

This operation allows the merchant to hold the amount of the order on
the customer bank account. It does consume the maximum payment cap of
the bank card, but does not charge the bank account.

This operation is well suited for a "charge at shipping" scenario :
the merchant makes an authorization when the customer place the order,
and the bank account is charged when the merchant actually does the
shipping.

In order to charge the bank account, you must do a **Capture**
operation.

> Please note that the authorization is only valid for a limited amount of time, and that you cannot capture a greater amount than the authorized one.

> You can capture the authorization multiple times, as long as there is some amount remaining. For instance, with an authorization of 100,00€, you can capture 20€, and then capture 80€ later, within the limited time.

### Technical information

The API route to use is the following :

```Javascript
/v1/payments/cardPayment
```

If you want to achieve a 3D-Secure payment, the API route to use is the
following

```Javascript
/v1/payments/card3DSPayment
```

The following fields have to be provided :

**Required** **Optional**

| **Fields**      | **Details** | **Type** | **Description** |
| --------------- | ----------- | -------- | --------------- |
| CardPaymentRequ |             |          |                 |
| est{            |             |          |                 |

+-----------------+-----------------+-----------------+-----------------+
| context | CardPaymentCont | | |
| | extData{ | | |
+-----------------+-----------------+-----------------+-----------------+
| | merchantId | integer(\$int32 | Merchant |
| | | ) | identifier |
+-----------------+-----------------+-----------------+-----------------+
| | merchantSiteId | string | Site identifier |
+-----------------+-----------------+-----------------+-----------------+
| | currency | string | ISO 4217 |
| | | | currency code |
+-----------------+-----------------+-----------------+-----------------+
| | | eur, dol \... | |
+-----------------+-----------------+-----------------+-----------------+
| | country | string | ISO 3166-1 |
| | | | alpha-2 country |
| | | | code |
+-----------------+-----------------+-----------------+-----------------+
| | | fr, es, us \... | |
+-----------------+-----------------+-----------------+-----------------+
| | paymentOptionRe | string | Defines the |
| | f | | payment method, |
| | | | |
| | | | example :"1" |
| | | | corresponds to |
| | | | card and "21" |
| | | | to card with |
| | | | 3DS=> see |
| | | | [referential](# |
| | | | payment-options |
| | | | -referential) |
+-----------------+-----------------+-----------------+-----------------+
| | customerRef | string | Customer |
| | | | identifier |
+-----------------+-----------------+-----------------+-----------------+
| | paymentAttempt | integer(\$int32 | Attempt of |
| | | ) | payment on this |
| | | | order (should |
| | | | be incremented |
| | | | if retry on the |
| | | | same order) |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| options | Options{ | | |
+-----------------+-----------------+-----------------+-----------------+
| | ReportDelayInDa | integer(\$int32 | Delay between |
| | ys | ) | payOrderRank |
| | | | and Capture |
| | | | (must be > 0 |
| | | | if used) |
+-----------------+-----------------+-----------------+-----------------+
| | AllowCardStorag | boolean | Determins if |
| | e | | card should be |
| | | | stored or not  |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| order | Order{ | | |
+-----------------+-----------------+-----------------+-----------------+
| | orderRef | string | Order |
| | | | identifier |
+-----------------+-----------------+-----------------+-----------------+
| | invoiceId | integer(\$int64 | Invoice |
| | | ) | identifier |
+-----------------+-----------------+-----------------+-----------------+
| | orderTag | string | Used for |
| | | | specific |
| | | | purpose  |
+-----------------+-----------------+-----------------+-----------------+
| | orderDate | string(\$date-t | Order Date |
| | | ime) | |
+-----------------+-----------------+-----------------+-----------------+
| | amount | integer(\$int32 | Payment amount |
| | | ) | |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| card | CardData{ | | |
+-----------------+-----------------+-----------------+-----------------+
| | cardOptionId | integer(\$int32 | Specific to |
| | | ) | credit cards |
+-----------------+-----------------+-----------------+-----------------+
| | cardScheme | string | |
+-----------------+-----------------+-----------------+-----------------+
| | | [ none, cb, | Card brand |
| | | visa, | |
| | | masterCard, | |
| | | cdiscount, | |
| | | casino, | |
| | | | |
| | | cofinoga, amex, | |
| | | finaref, | |
| | | aurore, | |
| | | cdiscount_Cup, | |
| | | diners, | |
| | | | |
| | | exito, | |
| | | exitoFranquicia | |
| | | , | |
| | | payPal, | |
| | | banContact, | |
| | | pse, paylib ] | |
+-----------------+-----------------+-----------------+-----------------+
| | expirationDate | string(\$date-t | Card expiration |
| | | ime) | date |
+-----------------+-----------------+-----------------+-----------------+
| | cardNumber | string | Card PAN |
+-----------------+-----------------+-----------------+-----------------+
| | securityNumber | string | CVV / CVC  |
+-----------------+-----------------+-----------------+-----------------+
| | cardLabel | string | Card Holder |
| | | | Name |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| storedCard | StoredCard{ | Specified if a | |
| | | storedCard si | |
| | | used | |
+-----------------+-----------------+-----------------+-----------------+
| | id | string | Storedcard |
| | | | Identifier |
+-----------------+-----------------+-----------------+-----------------+
| | label | string | StoredCard |
| | | | Label |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| validationMode | ValidationModeO | Overrides the | |
| | verride{ | parameters in | |
| | | place for the | |
| | | chosen | |
| | | MerchantId / | |
| | | MerchantSiteId | |
+-----------------+-----------------+-----------------+-----------------+
| | captureDelay | integer(\$int32 | Delay between |
| | | ) | capture and |
| | | | debit |
+-----------------+-----------------+-----------------+-----------------+
| | validationMode | string | |
+-----------------+-----------------+-----------------+-----------------+
| | | [ undefined, | if auto : |
| | | auto, manual ] | authorization+c |
| | | | apture |
| | | | in the same |
| | | | time |
| | | | |
| | | | if manual : |
| | | | authorization |
| | | | only, and then |
| | | | you must call |
| | | | capture |
| | | | operation |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| notificationUrl | string | Url to which a | |
| | | notification | |
| | | will be send | |
| | | once the | |
| | | payment process | |
| | | finished | |
+-----------------+-----------------+-----------------+-----------------+
| } | | | |
+-----------------+-----------------+-----------------+-----------------+

More details on the [Open API Specification](https://paymentgateway.recette-cdiscount.com/swagger/)

# Capture

This operation charges the bank account of the customer, following a
valid authorization done before. You need to provide a succedeed
authorized OrderRef, and the amount you want to charge.

As stated in the [Authorize](#authorize-1) page, this is well suited for
a "charge at shipping" scenario : the merchant makes an authorization
when the customer place the order, and the bank account is charged when
the merchant actually does the shipping.

> If you only want to capture the total amount of the authorization, you can simply set the amount to 0 in the request.

Usefull reminders from the [Authorize](#authorize-1) page :

> You can capture the authorization multiple times, as long as there is some amount remaining. For instance, with an authorization of 100,00€, you can capture 20€, and then capture 80€ later, within the limited time.

> Please note that the authorization is only valid for a limited amount of time, and that you cannot capture a greater amount than the authorized one.

### Technical information

The API route to use is the following :

```Javascript
PUT /v1/payments/{orderRef}/operations/capture
```

With the JSON body as defined below.

The fields are the following :

**Required** **Optional**

---

**Fields** **Type** **Description**

---

PaymentOperationsRequest{
merchantId integer(\$int32) The merchant identifier
merchantSiteId string The merchant site identifier.
attempt integer(\$int32) The attempt number (usefull if you retry an operation multiple times).
rank integer(\$int32) The rank concerned by the operation
amount integer(\$int64) The amount (if 0 the whole amount will be captured)
}

Example:

```JSON
{
  "merchantId": 1,
  "merchantSiteId": "100",
  "attempt": 1,
  "rank": 1,
  "amount": 0
}
```

More details on the [Open API
Specification](https://paymentgateway.recette-cdiscount.com/swagger/)

# Cancel or Refund

This operation allows the merchant to cancel (also refered to as
"void") or refund a transaction, according to its current state.

You can find below the exhaustive list of cases which may happen.

> With a **Cancel** operation, the customer will not see movement on his bank account, contrary to **Refund** which gives back the charged amount.
> Cancel is only performed when :
>
> - the transaction is not yet captured (in which case, the fund reservation on the customer payment method is cleared)
> - the operation occurs the same day as the capture operation.

> If you want to cancel or refund less than the original transaction amount, you can specify the amount in the request body. Alternatively you can specify an amount of 0 if you want to refund the total amount.
> **[Partial operation]{.underline}** : \*0 **<** amount **<** transaction's amount\
> **\*[Full operation]{.underline}** : _amount **==** transaction's amount **OR** amount **==** 0_

### Cancel Or Refund cases

#### After the authorization, and before the capture

_Because the refund operation cannot be executed on a non-captured
transaction, only the cancel operation is supported_

**Partial operation**
No interaction with partners because partial cancel/void is not supported.
The only impact is an update of the remaining amount to capture in payment hub

**Full operation**
**Cancel** operation will be executed on the entire transaction.
The fund reservation on the customer payment method will be cleared, and capture will no longer be possible.

> Cancelling a non captured transaction is not worldwide supported. Depending on the payment partner (PSP), the acquiring bank, and the issuing bank.

#### After the capture

Because the balance is made at midnight, either the cancel operation or
the refund operation will be selected depending on the date.

+-----------------------+-----------------------+-----------------------+
| | **_Partial | _**Full operation**_ |
| | operation_** | |
+=======================+=======================+=======================+
| **On the same day as | The **cancel** | The **cancel** |
| the capture | operation will be | operation will be |
| operation** | executed. | executed. |
| | | |
| | Partial cancelling of | Full cancel of a |
| | a captured | captured transaction |
| | transaction is | is fully supported. |
| | supported, but | |
| | doesn't behave the | |
| | same depending on the | |
| | payment partner used. | |
| | | |
| | In some cases, a | |
| | refund will be | |
| | executed instead. | |
+-----------------------+-----------------------+-----------------------+
| **D+1 and later** | The **refund** | The **refund** |
| | operation will be | operation will be |
| | executed.\ | executed.\ |
| | \ | \ |
| | Partial refund is | Full refund is fully |
| | fully supported. | supported. |
+-----------------------+-----------------------+-----------------------+

**Technical information**

The API route to use is the following :

PUT /v1/payments/{orderRef}/operations/cancelOrRefund

With the JSON body as defined below.

The fields are the following :

**Required** **Optional**

---

**Fields** **Type** **Description**

---

PaymentOperationsRequest{
merchantId integer(\$int32) The merchant identifier
merchantSiteId string The merchant site identifier.
attempt integer(\$int32) The attempt number (useful if you retry an operation multiple times).
rank integer(\$int32) The rank affected by the operation
amount integer(\$int64) The amount (if set to 0 the whole amount will be captured)
}

Example :

```JSON
{
    "merchantId": 1,
    "merchantSiteId": "8002",
    "attempt": 1,
    "rank": 1,
    "amount": 0
}
```

More details on the [Open API Specification](/ApiDocumentation/)

# Get details

This operation allows the merchant to retrieve some details about a
payment giving an order reference.

When calling this operation, Payment SAAS returns the schedule
associated with the order reference (and so does the amount, the state,
the date\...), and useful informations for making other operations, such
as the captured, remaining, cancelled and refunded amount.

### Technical information

There is 2 differents API route you can use :

Without orderTag :

```
 /v1/payments/{orderRef}/merchants/{merchantId}/sites/{merchantSiteId}
```

With orderTag (optional parameter, for specific purposes) :

```
/v1/payments/{orderRef}/merchants/{merchantId}/sites/{merchantSiteId}/{orderTag}
```

More details on the [Open API
Specification](/ApiDocumentation/)

# [POST] /PaymentSession

The PaymentSession is a way of initializing a payment with all the
necessary data (order informations, customer informations, payment
method\...)

without having to proceed all the different stages yourself.

Having creating a session you will get an URL wich will provide a
paymentform, so the customer will be able to complete the payment stages
al by himself.

You will also get a PaymentSessionId, to call the GetSession in order to
follow the payment's status.

In the first time, the merchant should provide all parameters below :

**Technical information**

The API route to use is the following :

```HTML
POST /v1/payment-sessions
```

With the JSON body as defined below.

The fields are the following :

**Required** **Optional**

---

+-----------------+-----------------+-----------------+-----------------+
| **Fields** | **Details** | **Type** | **Description** |
+=================+=================+=================+=================+
| merchantId | | integer(\$int32 | Merchant |
| | | ) | identifier |
+-----------------+-----------------+-----------------+-----------------+
| merchantSiteId | | string | Site identifier |
+-----------------+-----------------+-----------------+-----------------+
| customer { | | | |
+-----------------+-----------------+-----------------+-----------------+
| | billingAddress | Billing address | |
| | { | | |
+-----------------+-----------------+-----------------+-----------------+
| | ShippingAddress | Object | |
| | ^(1)^ | | |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| | birthDate | string(\$date-t | |
| | | ime) | |
+-----------------+-----------------+-----------------+-----------------+
| | civility | string | |
+-----------------+-----------------+-----------------+-----------------+
| | | [ unknown, | |
| | | mister, misses, | |
| | | miss ] | |
+-----------------+-----------------+-----------------+-----------------+
| | country | string | ISO 3166-1 |
| | | | alpha-2 country |
| | | | code |
+-----------------+-----------------+-----------------+-----------------+
| | | fr, es ,us | |
| | | \.... | |
+-----------------+-----------------+-----------------+-----------------+
| | customerIp | string | Customer ip |
+-----------------+-----------------+-----------------+-----------------+
| | customerRef | string | Customer |
| | | | identifier |
+-----------------+-----------------+-----------------+-----------------+
| | deliveryAddress | delivery | |
| | { | address | |
+-----------------+-----------------+-----------------+-----------------+
| | ShippingAddress | Object | |
| | ^(1)^ | | |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| | email | string | |
+-----------------+-----------------+-----------------+-----------------+
| | firstName | string | |
+-----------------+-----------------+-----------------+-----------------+
| | lastName | string | |
+-----------------+-----------------+-----------------+-----------------+
| | mobilePhone | string | |
+-----------------+-----------------+-----------------+-----------------+
| | phone | string | |
+-----------------+-----------------+-----------------+-----------------+
| } | | | |
+-----------------+-----------------+-----------------+-----------------+
| orderData { | | | |
+-----------------+-----------------+-----------------+-----------------+
| | orderDiscountAm | integer(\$int64 | |
| | ount | ) | |
+-----------------+-----------------+-----------------+-----------------+
| | orderFeesAmount | integer(\$int64 | |
| | | ) | |
+-----------------+-----------------+-----------------+-----------------+
| | orderRowsAmount | integer(\$int64 | |
| | | ) | |
+-----------------+-----------------+-----------------+-----------------+
| | orderShippingAm | integer(\$int64 | |
| | ount | ) | |
+-----------------+-----------------+-----------------+-----------------+
| | taxAmount | integer(\$int64 | |
| | | ) | |
+-----------------+-----------------+-----------------+-----------------+
| | freeText | integer(\$int64 | |
| | | ) | |
+-----------------+-----------------+-----------------+-----------------+
| | orders | Array of | |
| | | subOrders | |
+-----------------+-----------------+-----------------+-----------------+
| | +------------+ | For each | |
| | | [SubOrder | | subOrder you | |
| | | { | | will have to | |
| | | | | provide all | |
| | | amount | | these | |
| | | | | informations. | |
| | | inte | | | |
| | | ger(\$int6 | | | |
| | | 4) | | | |
| | | -------- | | | |
| | | ---------- | | | |
| | | ----- ---- | | | |
| | | ---------- | | | |
| | | ---- | | | |
| | | invoiceI | | | |
| | | d | | | |
| | | stri | | | |
| | | ng | | | |
| | | orderAmo | | | |
| | | untWithout | | | |
| | | Tax inte | | | |
| | | ger(\$int6 | | | |
| | | 4) | | | |
| | | orderRef | | | |
| | | | | | |
| | | stri | | | |
| | | ng | | | |
| | | taxAmoun | | | |
| | | t | | | |
| | | inte | | | |
| | | ger(\$int6 | | | |
| | | 4) | | | |
| | | | | | |
| | | }] | | | |
| | +------------+ | | |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| | orderSummaryRef | string | Order summary |
| | | | identifier (if |
| | | | multiple orders |
| | | | you have to |
| | | | provide a |
| | | | reference for |
| | | | the whole |
| | | | basket) else |
| | | | same as |
| | | | OrderRef |
+-----------------+-----------------+-----------------+-----------------+
| | shippingAddress | | |
| | { | | |
+-----------------+-----------------+-----------------+-----------------+
| | ShippingAddress | Object | |
| | ^(1)^ | | |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| | orderRef | string | Order |
| | | | identifier |
+-----------------+-----------------+-----------------+-----------------+
| | invoiceId | integer(\$int64 | Invoice |
| | | ) | identifier |
+-----------------+-----------------+-----------------+-----------------+
| | orderTag | string | Can be used for |
| | | | special cases |
+-----------------+-----------------+-----------------+-----------------+
| | orderDate | string(\$date-t | |
| | | ime) | |
+-----------------+-----------------+-----------------+-----------------+
| | amount | integer(\$int64 | Payment amount |
| | | ) | |
+-----------------+-----------------+-----------------+-----------------+
| } | | | |
+-----------------+-----------------+-----------------+-----------------+
| storedCardData | storedCardData | Specified if a | |
| | { | storedCard si | |
| | | used | |
+-----------------+-----------------+-----------------+-----------------+
| | id | string | Storedcard |
| | | | Identifier |
+-----------------+-----------------+-----------------+-----------------+
| | label | string | StoredCard |
| | | | Label |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+
| allowCardStorag | boolean | Should the user | |
| e | | have the option | |
| | | to store the | |
| | | card after | |
| | | payment | |
+-----------------+-----------------+-----------------+-----------------+
| forcedCardOptio | boolean | Option use for | |
| nRef | | paymentOptionRe | |
| | | f | |
| | | "CUP" | |
+-----------------+-----------------+-----------------+-----------------+
| forcedCardStora | boolean | force the | |
| ge | | payment card | |
| | | storage | |
+-----------------+-----------------+-----------------+-----------------+
| forcedImmediate | boolean | | |
| StoredCard | | | |
+-----------------+-----------------+-----------------+-----------------+
| configuration | configuration { | | |
+-----------------+-----------------+-----------------+-----------------+
| | culture | | |
+-----------------+-----------------+-----------------+-----------------+
| | formType | string | This field is |
| | | | elementary to |
| | | | Iframe payment, |
| | | | else the |
| | | | generated |
| | | | PaymentSession |
| | | | cannot be used |
| | | | in an Iframe |
+-----------------+-----------------+-----------------+-----------------+
| | | [ default, | |
| | | iframe ] | |
+-----------------+-----------------+-----------------+-----------------+
| | merchantBackUrl | string | |
+-----------------+-----------------+-----------------+-----------------+
| | merchantHomeUrl | string | |
+-----------------+-----------------+-----------------+-----------------+
| | merchantNotifyU | string | |
| | rl | | |
+-----------------+-----------------+-----------------+-----------------+
| | merchantReturnU | string | |
| | rl | | |
+-----------------+-----------------+-----------------+-----------------+
| | paymentOptionRe | string | |
| | f | | |
+-----------------+-----------------+-----------------+-----------------+
| | reportDelayInDa | integer(\$int32 | |
| | ys | ) | |
+-----------------+-----------------+-----------------+-----------------+
| | userAgent | string | |
+-----------------+-----------------+-----------------+-----------------+
| | } | | |
+-----------------+-----------------+-----------------+-----------------+

\(1) ShippingAddress Object :

**Fields** **Details** **Type** **Description**

---

ShippingAddress {
City string
line1 string
line2 string
name string
placeCalled string
ZipCode string
}

in Response :

Using **paymentSessionId** and **paymentSessionUrl** we can call the
corresponding payment page.

**Fields** **Details** **type** **Description**

---

PaymentSessionResponse {
operationSucceeded boolean Field indicating if the sesson has been created
paymentSessionId string Created Session Id
paymentSessionUrl string Created Payment URL
responseMessage string Empty if the operation was successful, else it will indicate why the operation has failed
}

# [GET] /PaymentSession

After using [[POST]
/PaymentSession](https://confluence.cdiscount.com/pages/viewpage.action)
, we use **PaymentSessionId** to get payment's status.

**Technical information**

The API route to use is the following :

```
GET /v1/payment-sessions/{paymentSessionId}/merchants/{merchantId}/sites/{merchantSiteId}
```

With the JSON body as defined below.

The fields are the following :

**Required** **Optional**

---

**Fields** **Details** **Type** **Description**

---

paymentSessionId  string The payment session id
merchantId  integer merchant Identifier
merchantSiteId  string merchant Site identifier
authToken  string Gets or sets the authentication token

In response :

**Fields** **Details** **Type** **Description**

---

orderRef  string Order reference
responseCode string Indicates the current status of the payment session
[ succeeded, refused, refusedByBank, failed, pending, unknown, cancelled, notProcessed ]
complementaryResponseCode string This field gives additional data about the status (ex: Refused by bank)
[ unknown, amountLimitExceeded, limitExceeded, technicalProblem, \... ]
responseMessage string

# Annex

- [Test environments](#test-environments)

- [Data dictionary](#data-dictionary)

- [Sequence diagrams](#sequence-diagrams)

- [Hosted Forms Screenshots](#hosted-forms-screenshots)

- [Test Data](#test-data)

- [Payment Options Referential](#payment-options-referential)

# Test environments

There is a test environment for front-end and back-end of Payment SAAS.

The REST API also has an OpenAPI Specification with Swagger.

| **Test Environment**          | **URL**                                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Front-end                     | [https://payment.recette-cdiscount.com](https://payment.recette-cdiscount.com)                                 |
| REST API (back-end)           | [https://paymentgateway.recette-cdiscount.com](https://paymentgateway.recette-cdiscount.com)                   |
| OpenAPI Specification Swagger | [https://paymentgateway.recette-cdiscount.com/swagger/](https://paymentgateway.recette-cdiscount.com/swagger/) |

> **ACCESS**
>
> The test environment is not open on the internet by default.
> You need to provide the list of public external IPs from which you want to access the URLs above. And we will give you access.

# Data dictionary

| **Field**                           | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | **Type**                                                |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **allowCardStorage**                | Flag allowing the storage of the used bank card<br/>Value in :<br/>- 0 (do not store the used bank card)<br/>- 1 (store the used bank card)<br/>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Number<br/>1 character                                  |
| **amount**                          | Total amount with taxes of the order                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Non-signed<br/>integer                                  |
| **complementaryReturnCode**         | Complementary code of the payment result<br/>Value in:<br/>- 0 (Unknown)<br/>- 1 (Exceeds the maximum allowed)<br/>- 2 (Amount too high)<br/>- 3 (Technical problem)<br/>- 4 (Authorized)<br/>- 5 (Fraud suspected by the bank)<br/>- 6 (Expired method of payment)<br/>- 7 (Cannot reach the issuer of the payment method)<br/>- 8 (Payment method holder not 3D-Secure authenticated)<br/>- 9 (Exceeded date of validity of the payment method)<br/>- 10 (Duplicated transaction : for a given day, this transaction identifier has already been used)<br/>- 11 (Format error)<br/>- 12 (Suspected fraud)<br/>- 13 (Transaction not authorized for this holder)<br/>- 14 (Invalid merchant contract)<br/>- 15 (Invalid payment method details)<br/>- 16 (Unknown issuer of payment method)<br/>- 17 (Invalid transaction)<br/>- 18 (Lost payment method)<br/>- 19 (Unknow transaction)<br/>- 20 (Request for authorization by phone to the bank due to exceeded authorization ceiling on the card, if it is possible to force transactions)<br/>- 21 (Refused authorized)<br/>- 22 (Not supported)<br/>- 23 (Security breach)<br/>- 24 (Security rules not fullfilled)<br/>- 25 (Unattainable server)<br/>- 26 (Stolen payment method)<br/>- 27 (System malfunction)<br/>- 28 (Bank server temporarily unavailable)<br/>- 29 (PSP server temporarily unavailable)<br/>- 30 (Transaction prohibited for this terminal)<br/>- 31 (Response not received or received too late)<br/>- 32 (Unknown acquisition organization identifier)<br/>- 33 (Unknown payment method)<br/>- 34 (Operation impossible because incompatible with the state of the transaction)<br/>- 35 (Transaction not found at the PSP because already archived)<br/>- 36 (Refusal issued by the « Scoring » service provider)<br/>- 37 (Number of attempts to enter the details of the payment method exceeded) | Number <br/> 1 to 2 characters                          |
| **currency**                        | Currency of the order<br/>ISO code 4217<br/>Example : EUR                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Alphanumeric<br/>3 characters                           |
| **customerRef**                     | Customer reference at the merchant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Alphanumeric<br/>30 characters max                      |
| **country**                         | Country Code ISO 3166-1 alpha-2<br/>Example : FR, BE                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Alphanumeric<br>2 characters                            |
| **culture**                         | Culture name (ex : fr-FR, en-US, es-CO, es-PA)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 5 characters <br/>format xx-XX                          |
| **date**                            | Order date with format YYYYMMDD<br/>Example : 20090706                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Number<br/>8 characters                                 |
| **decimalPosition**                 | Position of the decimal separator from the right<br/>Example : 2 for 2 decimals after the decimal point                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Integer                                                 |
| **forceImmediateStoredCardPayment** | Customer password request flag<br/>Value in :<br>- 0 (Do not force the immediate payment with stored card)<br/>- 1 (force the immediate payment with stored card)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Number<br/>1 character                                  |
| **forceUserCardStorage**            | CB registration forcing flag in the payment form<br/>Value in:<br/>- 0 (or not filled) do not force the storage of the card, and let the customer choose<br/>- 1 force the storage of the card without asking the customer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Number<br/>1 character                                  |
| **freeText**                        | Free text                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Alphanumeric                                            |
| **hmac**                            | Seal issue from the data certification<br/>(hmac = Hash-based Message Authentication Code)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Alphanumeric<br/>40 hexadecimal characters              |
| **invoiceID**                       | Invoice Identifier                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Alphanumeric<br/>30 characters max                      |
| **merchantAccountRef**              | Used contract identifier, as declared at the merchant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Not filled if the payment could not technically succeed |
| **merchantAuthenticateUrl**         | URL to which will be verified the password of the customer at the merchant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Alphanumeric                                            |
| **merchantBackUrl**                 | URL of the previous page (like "basket") of the merchant site                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |Alphanumeric|
| **merchantHomeUrl**                 | URL of the home page of the merchant site                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Alphanumeric                                            |
| **merchantNotifyUrl**               | URL by which the payment platform notifies the merchant site of the payment result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Alphanumeric                                            |
| **merchantReturnUrl**               | URL by which the payment platform notifies the merchant site of the payment result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Alphanumeric                                            |
| **merchantID**                      | Merchant identifier                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Non-signed integer                                      |
| **merchantSiteID**                  | Merchant's site identifier                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Alphanumeric<br/>30 characters max                      |
| **orderDiscountAmount**             | Total amount of the discounts associated with the order, in cents                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Non-signed integer                                      |
| **orderFeesAmount**                 | Total amount of the fees associated with the order, in cents                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Non-signed integer                                      |
| **orderRef**                        | Reference of the order at the merchant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Alphanumeric<br/>30 characters max                      |
| **orderTag**                        | Tag of the order<br/>Ex : version number, context identifier…                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Alphanumeric<br/>30 characters max                      |
| **orderRowsAmount**                 | Total amount with taxes of the rows of the order, in cents                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Non-signed integer                                      |
| **orderShippingCost**               | Total amount of the shipping costs associated with the order, in cents                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Non-signed integer                                      |
| **passwordRequired**                | Customer password request flag<br/>Value in :<br/>- 0 (do not ask for the password)<br/>- 1 (ask for the password)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Number<br/>1 character                                  |
| **payFormType**                     | Type of the payment form :<br/>- 0 : Default<br/>- 1 : Iframe (without header nor footer)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Number<br/>1 character                                  |
| **paymentOptionRef**                | Payment method identifier selected by the customer, as described by the merchant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Alphanumeric<br/>30 characters max                      |
| **returnCode**                      | Result code of the payment<br/>Value in:<br/>- 0 (Success)<br/>- 1 (Refused, invalid request)<br/>- 2 (Refused by bank)<br/>- 3 (Technical failure)<br/>- 4 (Pending)<br/>- 5 (Undetermined)<br/>- 6 (Cancelled)<br/>- 7 (untreated)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Number<br/>1 character                                  |
| **scheduleAmount**                  | Amount of the schedule, in cents                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Non-signed integer                                      |
| **scheduleCount**                   | Number of schedule                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Non-signed integer                                      |
| **scheduleDate**                    | Date of payment of the schedule, with format YYYYMMDD<br/>Example : 20090706                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Number<br/>8 characters                                 |
| **storedCardID**                    | Stored card identifier                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Alphanumeric<br/>40 characters max                      |
| **storedCardLabel**                 | Stored card label                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Alphanumeric<br/>30 characters max                      |
| **version**                         | Payment SAAS's version<br/>Currently 1.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Alphanumeric                                            |

|
| **uniqueTransactionId** | Unique transaction identifier<br/>This field is sent only for a litigation payment, and only if it is activated via the key « Feature.Payment.SendTransactionNumHMAC.Enabled » | Number |

# Sequence diagrams

- [Diagram : 3DS Cinematic (REST
  API)](<#Diagram-:-3DS-Cinematic-(REST-API)>)

- [Diagram : 3DS Cinematic with automatic Capture (REST
  API)](https://confluence.cdiscount.com/pages/viewpage.action)

- [Diagram : Add a card (REST
  API)](https://confluence.cdiscount.com/pages/viewpage.action)

- [Diagram : Authorize / Capture (REST
  API)](https://confluence.cdiscount.com/pages/viewpage.action)

- [Diagram : Authorize with automatic Capture (REST
  API)](https://confluence.cdiscount.com/pages/viewpage.action)

# Diagram : 3DS Cinematic (REST API)

![Diagram : 3DS Cinematic (REST API)](/staticFiles/media/6969bc7a-2364-4af0-9e47-ab68003882e4.png)

# Diagram : 3DS Cinematic with automatic Capture (REST API)

![Diagram : 3DS Cinematic with automatic Capture (REST API)](/staticFiles/media/c64531e2-2f08-495e-8923-53d51353d045.png)

# Diagram : Add a card (REST API)

![Diagram : Add a card (REST API)](/staticFiles/media/4d384e54-86ca-4476-ae5c-809c74260ede.png)

# Diagram : Authorize / Capture (REST API)

![Diagram : Authorize / Capture (REST API)](/staticFiles/media/aece53d2-227f-4bff-aebb-b2c1da87f014.png)

# Diagram : Authorize with automatic Capture (REST API)

![ Diagram : Authorize with automatic Capture (REST API)](/staticFiles/media/bdb3efac-79fb-4bc0-9099-766bc4848767.png)

# Hosted Forms Screenshots

# Bank Card payment form

## Initialization

![Init](/staicFiles/media/db7b29ad-0b33-4718-8f50-e3352e060aa7.png)

## Wrong card informations

![ Wrong card informations](/staticFiles/media/e935ee97-27d4-4853-9d64-86224307cab9.png)

## Wait page

![ Wait page](/staticFiles/media/ca0e73a1-f118-4d90-9415-87d17aac6889.png)

## 3D-Secure authentication

![3D-Secure authentication](/staticFiles/media/695c2468-f477-4b20-844f-1c6f9f0874eb.png)

## MerchantReturn page (shows the final POST result)

![MerchantReturn page (shows the final POST result)](/staticFiles/media/b3d580f5-fc45-4d4e-a298-0f774eb8649c.png)

# Test Data

This table below gives different information about test cases that
[provide a positive result] :

| **Card type by PSP**             | **Number**                            | **Expiration date** | **Security code (CVV)**                         | **Remarks**                           |
| -------------------------------- | ------------------------------------- | ------------------- | ----------------------------------------------- | ------------------------------------- |
| CB 3D-Secure enrolled (SIPS)     | 5017670000001800                      | Greater than today  | whatever 3-letters numeric code (000, 123, ...) | It should be used or considered first |
| CB 3D-Secure enrolled (PAYLINE)  | 8000110000000109<br/>4970101122334455 | Greater than today  | whatever 3-letters numeric code (000, 123, ...) | Password CDISCOUNT (for 3DSecure)     |
| CB Virtuelle 3D-Secure (PAYLINE) | 8000267359000005                      | Greater than today  | whatever 3-letters numeric code (000, 123, ...) | Password CDISCOUNT (for 3DSecure)     |
| CB Virtuelle 3D-Secure (SIPS)    | 5017670000011809<br/>5017674000010001 | Greater than today  | whatever 3-letters numeric code (000, 123, ...) | -                                     |
| CB (SIPS)                        | 5017670000005900                      | Greater than today  | whatever 3-letters numeric code (000, 123, ...) | It does KO payment on 3D secure       |

## **SIPS CARD GAME "Cases":**

In the other hand, the table below gives differents test card with
differents test cases that provide a negative result.\
Those specifics test cards only work with SIPS partner (Worldline).

| **Description**                             | **CB only**      | **CB/MC 3DS**    | **CB/MC non 3DS** | **CB/Visa 3DS**  | **CB/Visa non 3DS** | **Expiration date** | **Security code (CVV)**                         |
| ------------------------------------------- | ---------------- | ---------------- | ----------------- | ---------------- | ------------------- | ------------------- | ----------------------------------------------- |
| Not to deliver or accept<br/>”Do not honor” | 5017679100900605 | 5017679200300805 | 5017679200900505  | 5017679400300605 | 5017679400900305    | Greater than today  | whatever 3-letters numeric code (000, 123, ...) |
| Invalid amount                              | 5017679100900613 | 5017679200300813 | 5017679200300813  | 5017679400300613 | 5017679400900313    | Greater than today  | whatever 3-letters numeric code (000, 123, ...) |
| Stolen card                                 | 5017679100900043 | 5017679200300243 | 5017679200900943  | 5017679400300043 | 5017679400900743    | Greater than today  | whatever 3-letters numeric code (000, 123, ...) |
| Validation date expired                     | 5017679100900654 | 5017679200300854 | 5017679200900554  | 5017679400300654 | 5017679400900354    | Greater than today  | whatever 3-letters numeric code (000, 123, ...) |
| Suspicion of fraud                          | 5017679100900159 | 5017679200300359 | 5017679200900059  | 5017679400300159 | 5017679400900859    | Greater than today  | whatever 3-letters numeric code (000, 123, ...) |

# Payment Options Referential

| **Reference** | **Definition**                |
| ------------- | ----------------------------- |
| 1             | Card                          |
| 17            | Paypal                        |
| 21            | Card with 3DS                 |
| 26            | Card 4 times                  |
| 37            | CUP Credit Card               |
| 38            | CUP Credit Card subscription  |
| 40            | American Express              |
| 42            | Card with 3DS 4 times         |
| 55            | Card Bancontact Mistercash    |
| 84            | SEPA Direct Debit (SDD)       |
| 87            | CUP Credit Card with 3DS      |
| 88            | LYDIA                         |
| 90            | PAYLIB                        |
| 91            | Apple Pay                     |
