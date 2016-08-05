require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:source_statements) do
      Integer :source_id, :index => true
      primary_key [:source_id, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end
