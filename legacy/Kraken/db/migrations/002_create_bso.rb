require 'sequel'
Sequel.extension :migration

Sequel.migration do
  change do
    create_table(:bso) do
      primary_key :id
      Integer :first, index: true
      Integer :last, index: true
      Integer :book_id
      Integer :source_id
      Integer :occurrence_id
      Integer :role_id
      Integer :word_count
    end
  end
end
