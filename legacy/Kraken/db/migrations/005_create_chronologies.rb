require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:chronologies) do
      foreign_key :actant_id, :actants
      Integer :chronology_id
      primary_key [:actant_id, :chronology_id]
    end
  end
end
