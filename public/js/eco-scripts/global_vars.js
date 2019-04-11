/* ======================================  */
/* Some Global Variables  */
/* Basic counters */
var numberCompilations = 0;
var numberDeploys = 0;
var numberInvokes = 0;

/* Mostly used to get the current commit of GitHub repo */
var refreshIntervalWalletId = 0;
var refreshIntervalEcoMetadataStatsId = 0;
var refreshIntervalNeoCliNodes = 0;
var refreshIntervalCompilers = 0;
var refreshGenesisBlock = 0;
var refreshHeadersNeoCliNeoScan = 0;

/* Set Default API Provider var for NEONJS */
var NEON_API_PROVIDER;

/* Enable NEOSCAN explorer on the frontend */
var ENABLE_NEOSCAN_TRACKING = false;

/* Full activity history of all transactions */
var FULL_ACTIVITY_HISTORY = false;

/* Automatic pic csharp node at best height */
var AUTOMATIC_PIC_CSHARP_NODE_BEST_HEGITH = true;
var LAST_BEST_HEIGHT_NEOCLI = 0;

/* LAST ACTIVE TAB BEFORE ACTIVITY */
var LAST_ACTIVE_TAB_BEFORE_ACTIVITY = "network";

/* Mostly used to get the current commit of GitHub repo */
//var ENV_VARS = "";
/* End Some Global Variables  */
/* ======================================  */

var NUMBER_FAILS_REQUESTS = 0;
var MAX_N_FAILLED_REQUEST_UNTIL_STOP = 20;
var NEO_CLI_REFRESHING_STOPED = FALSE;
function stopAllEcoLabFrontEndTimeoutIntervals(){
    //Check current if refresh interval was set and, then, cancel it
    if(refreshIntervalWalletId!=0)
      clearInterval(refreshIntervalWalletId);

    if(refreshIntervalEcoMetadataStatsId!=0)
      clearInterval(refreshIntervalEcoMetadataStatsId);

    if(refreshIntervalNeoCliNodes!=0)
      clearInterval(refreshIntervalNeoCliNodes);

    if(refreshIntervalCompilers!=0)
      clearInterval(refreshIntervalCompilers);

    if(refreshGenesisBlock!=0)
      clearInterval(refreshGenesisBlock);
}
