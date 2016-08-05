require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:sphere_statements) do
      String :sphere_id, :index => true
      primary_key [:sphere_id, :statement_id]
      foreign_key :statement_id, :statements
    end
  end
end
