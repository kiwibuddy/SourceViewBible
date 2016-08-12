require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:actants) do
      primary_key :id, index: true
      Integer :actant_number
      String :chronologies
      Integer :gender
      String :natures
      String :professions
    end
  end
end
