const UserController = require("../controllers/Users.controller")
const AccountController = require("../controllers/Accounts.controller")
const TransactionController = require("../controllers/Transactions.controller")
const PocketController = require("../controllers/Pockets.controller")
const InternalTransactionController = require("../controllers/InternalTransactions.controller")
const ExternalTransactionController = require("../controllers/ExternalTransactions.controller")
const BillController = require("../controllers/Bills.controller")
const ReloadCivicaController = require("../controllers/ReloadCivica.controller")
const PhoneRechargeController = require("../controllers/PhoneRecharges.controller")
const PhoneBundleController = require("../controllers/PhoneBundles.controller")
const RechargeController = require("../controllers/Recharges.controller")
const WithdrawController = require("../controllers/Withdraws.controller")
const PocketTransactionController = require("../controllers/PocketTransactions.controller")
module.exports = {
    UserController,
    AccountController,
    TransactionController,
    PocketController,
    InternalTransactionController,
    ExternalTransactionController,
    BillController,
    ReloadCivicaController,
    PhoneRechargeController,
    PhoneBundleController,
    RechargeController,
    WithdrawController,
    PocketTransactionController
}