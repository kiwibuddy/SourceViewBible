require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:chronology_statements) do
      Integer :chronology_id, index: true
      primary_key [:chronology_id, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end
