require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:natures) do
      foreign_key :actant_id, :actants
      Integer :nature_id
      primary_key [:actant_id, :nature_id]
    end
  end
end
