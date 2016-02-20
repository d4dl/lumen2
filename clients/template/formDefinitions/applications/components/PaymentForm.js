[
    {
        html: "<span class='bigHeader'>Please remit an application fee of " + Lumen.STRIPE_APPLICATION_FEE_PRETTY  + " to complete the application process. " +
                                      "Visit the <a target='_blank' href=' " + Lumen.APPLICATION_URL  + " '>" +
                                      "Admissions Process</a> section of our website to RSVP to an Information Session or for more information. " +
                                      "We will be in touch soon about your application.</span>",
        border: false
    },
    {
        xtype: 'creditcardform',
        title: Lumen.i18n('Payment'),
        paymentType: 'applicationFee',
        layout: 'anchor',
        skipTraverse: true,
        amount: Lumen.CLIENT_STRIPE_APPLICATION_FEE,
        fee: Lumen.QUICKMIT_STRIPE_APPLICATION_FEE,
        defaults: {
            anchor: '100%'
        }
    }

]