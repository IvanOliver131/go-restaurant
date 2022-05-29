import { useEffect, useState } from 'react';

import api from '../../services/api';

import { FoodsContainer } from './styles';
import { Food } from '../../components/Food';
import { Header } from '../../components/Header';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

interface Food {
  id: number,
  name: string,
  description: string,
  price: string,
  available: boolean,
  image: string,
}


export function Dashboard() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food>({} as Food);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');

      setFoods(response.data);
    } 
    
    loadFoods();
  }, []);

  async function handleAddFood(food: Food) {
    const updatedFoods = [...foods];

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...updatedFoods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Food) {
    const updatedFoods = [...foods];

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = updatedFoods.map((f: Food) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    const updatedFoods = [...foods];

    await api.delete(`/foods/${id}`);

    const foodsFiltered = updatedFoods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    // sempre seta o valor ao contrario
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: Food)  {
    setEditModalOpen(true);
    setEditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

