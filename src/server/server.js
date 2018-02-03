var sqlite3 = require('sqlite3').verbose()
const path = require('path')

const filepath = path.join(process.resourcesPath, "src/server/appData.db");
// const filepath = path.resolve(__dirname, 'appData.db')
const db = new sqlite3.Database(filepath)
db.run( 'PRAGMA journal_mode = WAL;' );

db.serialize(function () {
  // Catered Units
  db.run('CREATE TABLE IF NOT EXISTS catered_units (id uuid unique primary key, pcco_id Varchar(100), short_code Varchar(100), description TEXT, coa_address TEXT, coa_address_2 TEXT, updated_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

  // Signatories
  db.run('CREATE TABLE IF NOT EXISTS signatories (id uuid unique primary key, name Varchar(255), ranks Varchar(255), branch Varchar(255), designation TEXT, updated_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

  // Account Codes
  db.run('CREATE TABLE IF NOT EXISTS account_codes (id uuid unique primary key, name Varchar(255), expense_class_id Varchar(255), old_account_code Varchar(255), new_account_code Varchar(255), main_class Varchar(255), sub_class Varchar(255), account_group Varchar(255), detailed_account Varchar(255), contra_account Varchar(255), sub_account Varchar(255), updated_at DATETIME, deleted_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

  // Procurement type
  db.run('CREATE TABLE IF NOT EXISTS procurement_types (id uuid unique primary key, code Varchar(255), description Varchar(255), updated_at DATETIME, deleted_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

  // SUPPLIERS
  db.run('CREATE TABLE IF NOT EXISTS suppliers (id uuid unique primary key, name Varchar(255), owner Varchar(255), address Varchar(255), tin Varchar(255), bank_id Varchar(255), is_blocked Varchar(255), blocked_remarks Varchar(255), date_blocked DATE, branch Varchar(255), account_number Varchar(255), account_type Varchar(255), cell_1 Varchar(255), cell_2 Varchar(255), phone_1 Varchar(255), phone_2 Varchar(255), fax_1 Varchar(255), fax_2 Varchar(255), email_1 Varchar(255), email_2 Varchar(255), status Varchar(255), updated_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

  // mode_of_procurements
  db.run('CREATE TABLE IF NOT EXISTS mode_of_procurements (id uuid unique primary key, name Varchar(255), description Varchar(255), updated_at DATETIME, deleted_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

  // chargeability
  db.run('CREATE TABLE IF NOT EXISTS chargeability (id uuid unique primary key, name Varchar(255), description Varchar(255), updated_at DATETIME, deleted_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

  // payment_terms
  db.run('CREATE TABLE IF NOT EXISTS payment_terms (id uuid unique primary key, name Varchar(255), description Varchar(255), updated_at DATETIME, deleted_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

  // Procurement Centers
  db.run('CREATE TABLE IF NOT EXISTS procurement_centers (id uuid unique primary key, name Varchar(255), short_code Varchar(255), address Varchar(255), programs Varchar(255), updated_at DATETIME, deleted_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

  // UPR
  db.run('CREATE TABLE IF NOT EXISTS unit_purchase_requests (id uuid unique primary key, place_of_delivery Varchar(255), procurement_office Varchar(255), mode_of_procurement Varchar(255), chargeability Varchar(255), procurement_type Varchar(255), total_amount Varchar(255), fund_validity Varchar(255), terms_of_payment Varchar(255), units Varchar(255), unit Varchar(255), other_infos TEXT, purpose TEXT, project_name Varchar(255), upr_number Varchar(255), ref_number Varchar(255), date_prepared Date, prepared_by Varchar(255), completed_at Date, cancelled_at Date, cancel_reason TEXT, remarks TEXT, update_remarks TEXT, date_processed DATETIME, processed_by Varchar(255), terminated_date DATETIME, terminate_status Varchar(255), terminated_by Varchar(255), requestor_id Varchar(255), fund_signatory_id Varchar(255), approver_id Varchar(255), requestor_text TEXT, fund_signatory_text TEXT, approver_text TEXT, status Varchar(255), state Varchar(255), days Varchar(255), delay_count Varchar(255), calendar_days Varchar(255), next_allowable Varchar(255), next_due Date, last_date Date, last_remarks TEXT, last_action TEXT, centers TEXT, next_step TEXT, updated_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

  // UPR Items
  db.run('CREATE TABLE IF NOT EXISTS unit_purchase_request_items (id uuid unique primary key, upr_id Varchar(255), item_description Varchar(255), quantity Varchar(255), unit_measurement Varchar(255), unit_price Varchar(255), total_amount Varchar(255), upr_number Varchar(255), ref_number Varchar(255), date_prepared Date, type Varchar(255), new_account_code Varchar(255), accounts Varchar(255), updated_at DATETIME, prepared_by Varchar(255), created_at DATETIME, is_sync Varchar(1), CONSTRAINT upr_number_unique UNIQUE (upr_number))')

  // form_headers
  db.run('CREATE TABLE IF NOT EXISTS form_headers (id uuid unique primary key, unit_id Varchar(255), content TEXT, updated_at DATETIME, created_at DATETIME, is_sync Varchar(1))')

})

db.close()
