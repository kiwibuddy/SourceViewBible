require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:source_type_statements) do
      Integer :source_type_id, index: true
      primary_key [:source_type_id, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end
