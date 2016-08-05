require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:source_actant_number_statements) do
      Integer :actant_number, index: true
      primary_key [:actant_number, :statement_id]
      foreign_key :statement_id, :statements
    end

    create_table(:recipient_actant_number_statements) do
      Integer :actant_number, index: true
      primary_key [:actant_number, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end
