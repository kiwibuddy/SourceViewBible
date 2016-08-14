require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:bso_actants) do
      primary_key :id
      foreign_key :actant_id, :actants
      Integer :type_id
      foreign_key :bso_id, :bso
      index [:actant_id, :type_id, :bso_id], unique: true
    end
  end
end
