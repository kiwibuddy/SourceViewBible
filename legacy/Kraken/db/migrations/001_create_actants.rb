require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:actants) do
      primary_key :id
      Integer :actant_number_id
      Integer :gender_id
    end
  end
end
