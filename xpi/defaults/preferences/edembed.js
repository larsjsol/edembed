pref("extensions.edembed.first_run", true);
pref("extensions.edembed.min_height", 100);

pref("extensions.edembed.default_suffix", ".edembed");

pref("extensions.edembed.suffixes.^wiki__text$", ".dokuwiki");
pref("extensions.edembed.suffixes.^wpTextbox1$", ".mediawiki");

pref("extensions.edembed.blacklist.^composebody$", true); //roundcube webmail
pref("extensions.edembed.blacklist.^textarea_DWT\\d+$", true); //zimbra6
