require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:actant_chronologies) do
      Integer :id, index: true
      Integer :chronology_id, index: true
      primary_key [:id, :chronology_id]
    end
  end
end
