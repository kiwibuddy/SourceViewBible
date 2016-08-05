require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:source_nature_statements) do
      Integer :nature_id, index: true
      primary_key [:nature_id, :statement_id]
      foreign_key :statement_id, :statements
    end

    create_table(:recipient_nature_statements) do
      Integer :nature_id, index: true
      primary_key [:nature_id, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end
