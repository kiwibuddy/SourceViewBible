require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:actant_roles) do
      Integer :id, index: true
      Integer :role_id, index: true
      primary_key [:id, :role_id]
    end
  end
end
