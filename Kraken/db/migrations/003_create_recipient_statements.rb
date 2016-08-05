require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:recipient_statements) do
      Integer :recipient_id, index: true
      primary_key [:recipient_id, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end
