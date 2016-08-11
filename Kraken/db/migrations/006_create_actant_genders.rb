require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:actant_genders) do
      Integer :id, index: true
      Integer :gender_id, index: true
      primary_key [:id, :gender_id]
    end
  end
end
