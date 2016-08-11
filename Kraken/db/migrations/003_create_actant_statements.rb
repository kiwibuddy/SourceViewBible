require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:actant_statements) do
      Integer :id, index: true
      Boolean :source, index: true
      Boolean :recipient, index: true
      primary_key [:id, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end
