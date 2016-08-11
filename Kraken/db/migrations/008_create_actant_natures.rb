require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:actant_natures) do
      Integer :id, index: true
      Integer :nature_id, index: true
      primary_key [:id, :nature_id]
    end
  end
end
