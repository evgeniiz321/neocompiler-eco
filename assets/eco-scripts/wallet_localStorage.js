function getIDFromExtraAccount(addressToSearch) {
    for (ea = 0; ea < ECO_EXTRA_ACCOUNTS.length; ++ea)
        if (ECO_EXTRA_ACCOUNTS[ea].account.address == addressToSearch)
            return ea;

    console.error("ERROR WHILE SEARCHING FOR ADDRESS");
    swal2Simple("Search error", "ERROR WHILE SEARCHING FOR ADDRESS", 5500, "error");
    return -1;
}
function getIDFromExtraAccountStillEncrypted(baseEncrypted, encryptedToSearch) {
    for (ea = 0; ea < baseEncrypted.length; ++ea)
        if (baseEncrypted[ea].encrypted != undefined)
            if (baseEncrypted[ea].encrypted == encryptedToSearch)
                return ea;

    console.error("ERROR WHILE SEARCHING FOR ADDRESS");
    swal2Simple("Search error", "ERROR WHILE SEARCHING FOR ADDRESS", 5500, "error");
    return -1;
}


async function getExtraWalletAccountFromLocalStorage() {
    var mySafeExtraAccountsWallet = getLocalStorage("mySafeEncryptedExtraAccounts");
    if (mySafeExtraAccountsWallet) {
        mySafeExtraAccountsWallet = JSON.parse(mySafeExtraAccountsWallet);
        var myRecreatedExtraAccounts = [];

        await Promise.all(mySafeExtraAccountsWallet.map(async (accountData) => {
            var storedKey = accountData.key;
            var label = accountData.label;
            var print = accountData.print;

            var myRestoredAccount = new Neon.wallet.Account(storedKey);

            try {
                if (!Neon.wallet.isAddress(storedKey) && !Neon.wallet.isPublicKey(storedKey))
                    await myRestoredAccount.decrypt(MASTER_KEY_WALLET);

                myRecreatedExtraAccounts.push({
                    account: myRestoredAccount,
                    label: label,
                    print: print
                });
            } catch (err) {
                console.error(err);
                swal2Simple("Decryption error", "Error when decrypting extra accounts!", 5500, "error");
            }
        }));
        return myRecreatedExtraAccounts;
    }
    return [];
}

function restoreWalletExtraAccountsLocalStorage() {
    var mySafeExtraAccountsWallet = getLocalStorage("mySafeEncryptedExtraAccounts");
    if (mySafeExtraAccountsWallet && MASTER_KEY_WALLET == "") {
        setMasterKey(() => {
            updateExtraAndEcoWallet();
        }, "Restoring accounts");
    } else {
        updateExtraAndEcoWallet();
    }
}

async function updateExtraAndEcoWallet() {
    var tempWallet = await getExtraWalletAccountFromLocalStorage();
    if (tempWallet.length > 0) {
        ECO_EXTRA_ACCOUNTS = tempWallet;
        ECO_WALLET = DEFAULT_WALLET.concat(ECO_EXTRA_ACCOUNTS);
        drawPopulateAllWalletAccountsInfo();
    }
}

function btnWalletSave() {
    if (ECO_EXTRA_ACCOUNTS.length > 0) {
        if (MASTER_KEY_WALLET == "") {
            swal2Simple("MASTER KEY IS EMPTY", "A password is required for saving new addresses", 5500, "error");
            return false;
        }

        var SAFE_ACCOUNTS = [];
        for (ea = 0; ea < ECO_EXTRA_ACCOUNTS.length; ++ea) {
            if (ECO_EXTRA_ACCOUNTS[ea].account._privateKey != undefined) {
                ECO_EXTRA_ACCOUNTS[ea].account.encrypt(MASTER_KEY_WALLET).then(encryptedAccount => {
                    var restoredID = getIDFromExtraAccount(encryptedAccount.address);
                    SAFE_ACCOUNTS.push({
                        key: encryptedAccount.encrypted,
                        label: ECO_EXTRA_ACCOUNTS[restoredID].label,
                        print: ECO_EXTRA_ACCOUNTS[restoredID].print
                    });
                    setLocalStorage("mySafeEncryptedExtraAccounts", JSON.stringify(SAFE_ACCOUNTS));
                }).catch(err => {
                    console.error(err);
                    swal2Simple("Encryption error", "Error when encripting extra accounts!", 5500, "error");
                });
            } else {
                SAFE_ACCOUNTS.push({
                    key: ECO_EXTRA_ACCOUNTS[ea].account.address,
                    label: ECO_EXTRA_ACCOUNTS[ea].label,
                    print: ECO_EXTRA_ACCOUNTS[ea].print
                });
                setLocalStorage("mySafeEncryptedExtraAccounts", JSON.stringify(SAFE_ACCOUNTS));
            }
        }
    } else {
        localStorage.removeItem("mySafeEncryptedExtraAccounts");
    }
}

function btnWalletClean() {
    // This filter also worked
    //ECO_WALLET = ECO_WALLET.filter( ( el ) => !ECO_EXTRA_ACCOUNTS.includes( el ) );
    ECO_WALLET = DEFAULT_WALLET;
    ECO_EXTRA_ACCOUNTS = [];
    localStorage.removeItem("mySafeEncryptedExtraAccounts");
    drawPopulateAllWalletAccountsInfo();
}


// teste
// 05afacd091c544f8ff9cec33353effde2b26a7153a074afd2b09958021ebdba9