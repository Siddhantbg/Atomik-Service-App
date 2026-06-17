export type LegalSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro?: string[];
  sections: LegalSection[];
};

export const PRIVACY_POLICY: LegalDocument = {
  title: 'Privacy Policy',
  lastUpdated: '12th Nov, 2024',
  intro: [
    'This Privacy Notice for Karma Electric (doing business as Atomik) ("we", "us", or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:',
    '– Visit our website at http://www.atomikaudio.com, or any website of ours that links to this Privacy Notice',
    '– Engage with us in other related ways, including any sales, marketing, or events',
    'Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at contact@atomikaudio.com.',
  ],
  sections: [
    {
      heading: 'Summary Of Key Points',
      paragraphs: [
        'This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics in the sections below.',
        'What personal information do we process? When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.',
        'Do we process any sensitive personal information? We do not process sensitive personal information.',
        'Do we collect any information from third parties? We do not collect any information from third parties.',
        'How do we process your information? We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.',
        'In what situations and with which parties do we share personal information? We may share information in specific situations and with specific third parties.',
        'How do we keep your information safe? We have adequate organisational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.',
        'What are your rights? Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.',
        'How do you exercise your rights? The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us at contact@atomikaudio.com.',
      ],
    },
    {
      heading: '1. What Information Do We Collect?',
      paragraphs: [
        'In Short: We collect personal information that you provide to us.',
        'We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.',
        'Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:',
      ],
      bullets: ['names', 'phone numbers', 'email addresses', 'mailing addresses'],
    },
    {
      paragraphs: [
        'Sensitive Information. We do not process sensitive information. All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.',
      ],
    },
    {
      heading: '2. How Do We Process Your Information?',
      paragraphs: [
        'In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.',
        'We process your personal information for a variety of reasons, depending on how you interact with our Services, including:',
      ],
      bullets: [
        'To deliver and facilitate delivery of services to the user.',
        'To request feedback.',
        'To deliver targeted advertising to you.',
        'To evaluate and improve our Services, products, marketing, and your experience.',
        'To identify usage trends.',
        'To comply with our legal obligations.',
      ],
    },
    {
      heading: '3. When And With Whom Do We Share Your Personal Information?',
      paragraphs: [
        'In Short: We may share information in specific situations described in this section and/or with the following third parties.',
        'Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.',
      ],
    },
    {
      heading: '4. Do We Use Cookies And Other Tracking Technologies?',
      paragraphs: [
        'In Short: We may use cookies and other tracking technologies to collect and store your information.',
        'We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.',
        'We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences).',
      ],
    },
    {
      heading: '5. How Long Do We Keep Your Information?',
      paragraphs: [
        'In Short: We keep your information for as long as necessary to fulfil the purposes outlined in this Privacy Notice unless otherwise required by law.',
        'We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymise such information, or, if this is not possible, then we will securely store your personal information and isolate it from any further processing until deletion is possible.',
      ],
    },
    {
      heading: '6. How Do We Keep Your Information Safe?',
      paragraphs: [
        'In Short: We aim to protect your personal information through a system of organisational and technical security measures.',
        'We have implemented appropriate and reasonable technical and organisational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.',
      ],
    },
    {
      heading: '7. What Are Your Privacy Rights?',
      paragraphs: [
        'In Short: You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.',
        'Withdrawing your consent: If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time by contacting us. However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.',
        'Cookies and similar technologies: Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.',
        'If you have questions or comments about your privacy rights, you may email us at contact@atomikaudio.com.',
      ],
    },
    {
      heading: '8. Controls For Do-Not-Track Features',
      paragraphs: [
        'Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognising and implementing DNT signals has been finalised. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.',
      ],
    },
    {
      heading: '9. Do We Make Updates To This Notice?',
      paragraphs: [
        'In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.',
        'We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.',
      ],
    },
    {
      heading: '10. How Can You Contact Us About This Notice?',
      paragraphs: [
        'If you have questions or comments about this notice, you may email us at contact@atomikaudio.com or contact us by post at:',
        'Karma Electric\nNo 33, Katha no 270/1,\nKanakagiri Main Road, Hormavu Agra\nBangalore, Karnataka 560043,\nIndia',
      ],
    },
    {
      heading: '11. How Can You Review, Update, Or Delete The Data We Collect From You?',
      paragraphs: [
        'Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please fill out and submit a data subject access request or contact us at contact@atomikaudio.com.',
      ],
    },
  ],
};

export const TERMS_CONDITIONS: LegalDocument = {
  title: 'Terms & Conditions',
  lastUpdated: '13th Nov, 2024',
  intro: [
    'We are Karma Electric ("Company," "we," "us," "our"). We operate Atomik, as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").',
    'You can contact us by email at contact@atomikaudio.com or by mail to No 33, Katha No 270/1, Kanakagiri Main Road, Horamavu Agra, Bangalore – 560043, India.',
    'These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Karma Electric, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.',
    'Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms.',
  ],
  sections: [
    {
      heading: '1. Our Services',
      paragraphs: [
        'The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.',
      ],
    },
    {
      heading: '2. Intellectual Property Rights',
      paragraphs: [
        'We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").',
        'Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in the United States and around the world.',
        'Subject to your compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable license to access the Services and download or print a copy of any portion of the Content to which you have properly gained access, solely for your personal, non-commercial use or internal business purpose.',
        'Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.',
        'If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: contact@atomikaudio.com',
      ],
    },
    {
      heading: '3. User Representations',
      paragraphs: [
        'By using the Services, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Legal Terms; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Services for any illegal or unauthorized purpose; and (5) your use of the Services will not violate any applicable law or regulation.',
        'If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).',
      ],
    },
    {
      heading: '4. Prohibited Activities',
      paragraphs: [
        'You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.',
        'As a user of the Services, you agree not to:',
      ],
      bullets: [
        'Systematically retrieve data or other content from the Services to create or compile a collection, compilation, database, or directory without written permission from us.',
        'Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.',
        'Circumvent, disable, or otherwise interfere with security-related features of the Services.',
        'Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.',
        'Use any information obtained from the Services in order to harass, abuse, or harm another person.',
        'Make improper use of our support services or submit false reports of abuse or misconduct.',
        'Use the Services in a manner inconsistent with any applicable laws or regulations.',
        'Engage in unauthorized framing of or linking to the Services.',
        'Upload or transmit viruses, Trojan horses, or other material that interferes with any party\'s uninterrupted use and enjoyment of the Services.',
        'Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.',
        'Attempt to impersonate another user or person or use the username of another user.',
        'Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.',
        'Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services.',
        'Copy or adapt the Services\' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.',
        'Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services, except as permitted by applicable law.',
        'Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.',
      ],
    },
    {
      heading: '5. User Generated Contributions',
      paragraphs: [
        'The Services may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Services and through third-party websites.',
      ],
    },
    {
      heading: '6. Contribution License',
      paragraphs: [
        'You and Services agree that we may access, store, process, and use any information and personal data that you provide and your choices (including settings).',
        'By submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose without compensation to you.',
        'We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions.',
      ],
    },
    {
      heading: '7. Services Management',
      paragraphs: [
        'We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms; (3) refuse, restrict access to, limit the availability of, or disable any of your Contributions or any portion thereof; (4) remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.',
      ],
    },
    {
      heading: '8. Term And Termination',
      paragraphs: [
        'These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION.',
        'If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party.',
      ],
    },
    {
      heading: '9. Modifications And Interruptions',
      paragraphs: [
        'We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.',
        'We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors.',
      ],
    },
    {
      heading: '10. Governing Law',
      paragraphs: [
        'These Legal Terms shall be governed by and defined following the laws of India. Karma Electric and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.',
      ],
    },
    {
      heading: '11. Dispute Resolution',
      paragraphs: [
        'To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a "Dispute"), the Parties agree to first attempt to negotiate any Dispute informally for at least 60 days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.',
        'The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action basis or to utilize class action procedures; and (c) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.',
        'The Parties agree that the following Disputes are not subject to the above provisions concerning informal negotiations and binding arbitration: (a) any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party; (b) any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive relief.',
      ],
    },
    {
      heading: '12. Corrections',
      paragraphs: [
        'There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.',
      ],
    },
    {
      heading: '13. Disclaimer',
      paragraphs: [
        'THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
        'WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES\' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, PERSONAL INJURY OR PROPERTY DAMAGE, UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS, ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS.',
      ],
    },
    {
      heading: '14. Limitations Of Liability',
      paragraphs: [
        'IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.',
        'NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID, IF ANY, BY YOU TO US. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.',
      ],
    },
    {
      heading: '15. Indemnification',
      paragraphs: [
        'You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys\' fees and expenses, made by any third party due to or arising out of: (1) use of the Services; (2) breach of these Legal Terms; (3) any breach of your representations and warranties set forth in these Legal Terms; (4) your violation of the rights of a third party, including but not limited to intellectual property rights; or (5) any overt harmful act toward any other user of the Services with whom you connected via the Services.',
      ],
    },
    {
      heading: '16. User Data',
      paragraphs: [
        'We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.',
      ],
    },
    {
      heading: '17. Electronic Communications, Transactions, And Signatures',
      paragraphs: [
        'Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing.',
        'YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES.',
      ],
    },
    {
      heading: '18. Miscellaneous',
      paragraphs: [
        'These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time.',
      ],
    },
    {
      heading: '19. Contact Us',
      paragraphs: [
        'In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at: contact@atomikaudio.com',
      ],
    },
  ],
};
