require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:bso_actants) do
      primary_key :id
      foreign_key :actant_id, :actants
      Integer :type
      foreign_key :source_id, :sources
      index [:actant_type, :type], unique: true
    end
  end
end
