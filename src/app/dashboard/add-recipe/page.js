'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ChefHat, Upload, Plus, Trash2, Loader2, AlertTriangle, Sparkles, Wand2, X, CheckCircle2, Check, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AddRecipe() {
  const { user, fetchWithAuth } = useApp();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recipeCount, setRecipeCount] = useState(0);
  const [error, setError] = useState('');
  
  // ImgBB Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    recipeName: '',
    recipeImage: '',
    category: 'Main Course',
    cuisineType: '',
    difficultyLevel: 'Easy',
    preparationTime: '',
    instructions: '',
    isPremium: true,
  });

  const [ingredients, setIngredients] = useState(['']);

  // AI Recipe Generator States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCuisine, setAiCuisine] = useState('');
  const [aiCategory, setAiCategory] = useState('Main Course');
  const [aiDiet, setAiDiet] = useState('None');
  const [aiResult, setAiResult] = useState(null);
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim() && !aiCuisine) {
      setAiError('Please enter a recipe idea or select a cuisine.');
      return;
    }
    setAiGenerating(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          cuisine: aiCuisine,
          category: aiCategory,
          dietaryPreference: aiDiet,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setAiResult(data.data);
      } else {
        setAiError(data.message || 'Failed to generate recipe with AI. Please try again.');
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
      setAiError('Failed to connect to AI service. Please check your network connection.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleApplyAiRecipe = () => {
    if (!aiResult) return;
    setFormData(prev => ({
      ...prev,
      recipeName: aiResult.recipeName || prev.recipeName,
      category: aiResult.category || prev.category,
      cuisineType: aiResult.cuisineType || prev.cuisineType,
      difficultyLevel: aiResult.difficultyLevel || prev.difficultyLevel,
      preparationTime: aiResult.preparationTime ? String(aiResult.preparationTime) : prev.preparationTime,
      instructions: aiResult.instructions || prev.instructions,
    }));
    if (Array.isArray(aiResult.ingredients) && aiResult.ingredients.length > 0) {
      setIngredients(aiResult.ingredients);
    }
    setShowAiModal(false);
    setAiSuccessMessage('✨ Recipe auto-filled by AI! You can customize any field, add an image, and submit.');
    setTimeout(() => setAiSuccessMessage(''), 8000);
  };

  useEffect(() => {
    const checkRecipeLimit = async () => {
      if (!user) return;
      try {
        const res = await fetchWithAuth(`/api/auth/stats`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setRecipeCount(data.data.totalRecipes);
          }
        }
      } catch (err) {
        console.error("Failed to check recipe limits:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    checkRecipeLimit();
  }, [user]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError('');
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Upload file to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    // Previews locally first
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    const body = new FormData();
    body.append('image', file);

    try {
      const imgbbRes = await fetch(`/api/image-upload`, {
        method: 'POST',
        body
      });

      if (imgbbRes.ok) {
        const imgbbData = await imgbbRes.json();
        if (imgbbData.success) {
          setFormData(prev => ({ ...prev, recipeImage: imgbbData.data.url }));
        } else {
          setError(imgbbData.error?.message || 'Failed to upload image to ImgBB.');
        }
      } else {
        setError('Failed to upload image. Server responded with error.');
      }
    } catch (err) {
      console.error(err);
      setError('ImgBB upload request failed. Please paste an image URL directly.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { recipeName, recipeImage, category, cuisineType, difficultyLevel, preparationTime, instructions, isPremium } = formData;
    const filteredIngredients = ingredients.map(i => i.trim()).filter(Boolean);

    if (!recipeName || !cuisineType || !preparationTime || !instructions || filteredIngredients.length === 0) {
      setError('Please fill in all required fields and add at least one ingredient.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/recipes`, {
        method: 'POST',
        body: JSON.stringify({
          recipeName,
          recipeImage,
          category,
          cuisineType,
          difficultyLevel,
          preparationTime,
          ingredients: filteredIngredients,
          instructions,
          isPremium
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/dashboard/my-recipes');
      } else {
        setError(data.message || 'Failed to submit recipe.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please check server connections.');
    } finally {
      setLoading(false);
    }
  };

  if (statsLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 size={30} className="text-brand animate-spin" />
      </div>
    );
  }

  // Block upload if standard user has 2 recipes
  const isBlocked = !user?.isPremium && user?.role !== 'admin' && recipeCount >= 2;

  if (isBlocked) {
    return (
      <div className="border border-border-custom bg-card-custom rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xl space-y-6">
        <div className="h-16 w-16 mx-auto bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground-custom tracking-tight">Upload limit reached</h2>
          <p className="text-sm text-foreground-custom/60 leading-relaxed">
            Standard members are limited to a maximum of 2 recipes. You currently have <span className="font-bold">{recipeCount}</span> recipes posted. Upgrade to Premium to unlock unlimited recipe uploads!
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6 flex items-center justify-between text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground-custom flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" />
              <span>Premium Membership</span>
            </h4>
            <p className="text-xs text-foreground-custom/60">Display badge and post unlimited recipes</p>
          </div>
          <span className="text-lg font-black text-foreground-custom">$9.99</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/dashboard/profile"
            className="flex-1 bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-xl transition-all shadow-lg text-center"
          >
            Upgrade Now
          </Link>
          <Link
            href="/dashboard/my-recipes"
            className="flex-1 border border-border-custom hover:bg-foreground-custom/5 text-foreground-custom font-bold py-3 rounded-xl transition-all text-center"
          >
            View My Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground-custom tracking-tight">Add New Recipe</h1>
        <p className="text-foreground-custom/60 text-sm">Fill in the fields below to share your cooking guide.</p>
      </div>

      {error && (
        <div className="flex items-start space-x-2.5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Recipe Generator Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-brand/10 to-orange-500/10 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm">
              <Sparkles size={16} className="animate-pulse" />
              <span>Gemini AI Recipe Assistant</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground-custom">Short on time? Let AI generate your recipe</h3>
            <p className="text-xs sm:text-sm text-foreground-custom/70 max-w-xl">
              Describe an idea, key ingredients, or flavor profile. Gemini AI will create the full recipe and auto-fill this form for you in seconds!
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAiModal(true);
              setAiError('');
            }}
            className="shrink-0 flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-brand hover:from-amber-600 hover:to-brand-hover text-white font-bold px-5 py-2.5 rounded-2xl shadow-md transition-all text-sm cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Generate with AI ✨</span>
          </button>
        </div>
      </div>

      {aiSuccessMessage && (
        <div className="flex items-center space-x-2.5 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{aiSuccessMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card-custom border border-border-custom p-6 sm:p-8 rounded-3xl shadow-sm">
        {/* Row 1: Name & Category **/}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground-custom">Recipe Name *</label>
            <input
              name="recipeName"
              type="text"
              required
              value={formData.recipeName}
              onChange={handleChange}
              placeholder="e.g. Classic Margherita Pizza"
              className="w-full bg-card-custom border border-border-custom rounded-2xl p-3 text-sm text-foreground-custom focus:outline-none focus:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground-custom">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-card-custom border border-border-custom rounded-2xl p-3 text-sm text-foreground-custom focus:outline-none focus:border-brand"
            >
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Beverage">Beverage</option>
              <option value="Salad">Salad</option>
              <option value="Soup">Soup</option>
            </select>
          </div>
        </div>

        {/* Row 2: Cuisine, Difficulty, Prep Time **/}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground-custom">Cuisine Type *</label>
            <input
              name="cuisineType"
              type="text"
              required
              value={formData.cuisineType}
              onChange={handleChange}
              placeholder="e.g. Italian, Mexican"
              className="w-full bg-card-custom border border-border-custom rounded-2xl p-3 text-sm text-foreground-custom focus:outline-none focus:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground-custom">Difficulty Level *</label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full bg-card-custom border border-border-custom rounded-2xl p-3 text-sm text-foreground-custom focus:outline-none focus:border-brand"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground-custom">Prep Time (minutes) *</label>
            <input
              name="preparationTime"
              type="number"
              required
              min="1"
              value={formData.preparationTime}
              onChange={handleChange}
              placeholder="e.g. 45"
              className="w-full bg-card-custom border border-border-custom rounded-2xl p-3 text-sm text-foreground-custom focus:outline-none focus:border-brand"
            />
          </div>
        </div>



        {/* Image Upload Block */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground-custom">Recipe Image *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File Upload Zone */}
            <div className="border border-dashed border-border-custom hover:border-brand/40 bg-foreground-custom/[0.01] rounded-2xl p-6 text-center cursor-pointer transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                disabled={uploadingImage}
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                {uploadingImage ? (
                  <>
                    <Loader2 size={24} className="text-brand animate-spin" />
                    <span className="text-xs font-semibold text-foreground-custom/60">Uploading to ImgBB...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-foreground-custom/40" />
                    <span className="text-xs font-semibold text-foreground-custom/70">Upload Image File</span>
                    <span className="text-[10px] text-foreground-custom/40">ImgBB integration</span>
                  </>
                )}
              </div>
            </div>

            {/* Direct Image URL & Preview */}
            <div className="space-y-3 flex flex-col justify-center">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-foreground-custom/60 block">Or paste Direct Image URL</span>
                <input
                  name="recipeImage"
                  type="url"
                  value={formData.recipeImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-card-custom border border-border-custom rounded-xl p-2.5 text-xs text-foreground-custom focus:outline-none focus:border-brand"
                />
              </div>

              {/* Local/Direct Image Preview */}
              {(imagePreview || formData.recipeImage) && (
                <div className="h-20 w-32 rounded-xl overflow-hidden border border-border-custom self-start">
                  <img
                    src={formData.recipeImage || imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ingredients Nested Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground-custom">Ingredients *</label>
            <button
              type="button"
              onClick={addIngredient}
              className="text-brand text-xs font-bold hover:underline flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Add Ingredient</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  required
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder={`Ingredient #${index + 1}`}
                  className="flex-grow bg-card-custom border border-border-custom rounded-xl p-2.5 text-sm text-foreground-custom focus:outline-none focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length === 1}
                  className="p-2.5 border border-border-custom rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground-custom">Instructions *</label>
          <textarea
            name="instructions"
            required
            rows="6"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Step 1: Preheat oven to 450°F...
Step 2: Roll out the pizza dough..."
            className="w-full bg-card-custom border border-border-custom rounded-2xl p-4 text-sm text-foreground-custom focus:outline-none focus:border-brand leading-relaxed"
          />
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-border-custom">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-brand/10 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Submitting recipe...</span>
              </>
            ) : (
              <span>Submit Recipe</span>
            )}
          </button>
        </div>
      </form>

      {/* AI Recipe Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-card-custom rounded-3xl p-6 sm:p-8 border border-border-custom shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-custom">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-brand/20 text-amber-500">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground-custom flex items-center gap-2">
                    <span>AI Recipe Generator</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded-full uppercase border border-amber-500/20">
                      Gemini
                    </span>
                  </h3>
                  <p className="text-xs text-foreground-custom/60">Describe what you want to cook and AI will handle the rest.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="p-2 rounded-full hover:bg-foreground-custom/10 text-foreground-custom/60 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {aiError && (
              <div className="flex items-start space-x-2.5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <span>{aiError}</span>
              </div>
            )}

            {!aiResult ? (
              /* Generation Form */
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground-custom">
                    Recipe Concept, Dish Name, or Ingredients *
                  </label>
                  <textarea
                    rows="3"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Creamy Tuscan Garlic Chicken with sun-dried tomatoes and fresh spinach, ready in under 30 minutes..."
                    className="w-full bg-card-custom border border-border-custom rounded-2xl p-3.5 text-sm text-foreground-custom focus:outline-none focus:border-brand"
                  />
                  <p className="text-[11px] text-foreground-custom/50">
                    Tip: You can specify key ingredients you want to use, or simply the name of a dish you'd love to make.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground-custom">Cuisine Style</label>
                    <select
                      value={aiCuisine}
                      onChange={(e) => setAiCuisine(e.target.value)}
                      className="w-full bg-card-custom border border-border-custom rounded-xl p-2.5 text-sm text-foreground-custom focus:outline-none focus:border-brand"
                    >
                      <option value="">Any / Flexible</option>
                      <option value="Italian">Italian</option>
                      <option value="Mexican">Mexican</option>
                      <option value="Asian">Asian</option>
                      <option value="Indian">Indian</option>
                      <option value="Mediterranean">Mediterranean</option>
                      <option value="American">American</option>
                      <option value="French">French</option>
                      <option value="Thai">Thai</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Middle Eastern">Middle Eastern</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground-custom">Category</label>
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value)}
                      className="w-full bg-card-custom border border-border-custom rounded-xl p-2.5 text-sm text-foreground-custom focus:outline-none focus:border-brand"
                    >
                      <option value="Main Course">Main Course</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Beverage">Beverage</option>
                      <option value="Salad">Salad</option>
                      <option value="Soup">Soup</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground-custom">Dietary</label>
                    <select
                      value={aiDiet}
                      onChange={(e) => setAiDiet(e.target.value)}
                      className="w-full bg-card-custom border border-border-custom rounded-xl p-2.5 text-sm text-foreground-custom focus:outline-none focus:border-brand"
                    >
                      <option value="None">Standard / None</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                      <option value="Keto">Keto</option>
                      <option value="Low Carb">Low Carb</option>
                      <option value="High Protein">High Protein</option>
                      <option value="Dairy-Free">Dairy-Free</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleGenerateWithAi}
                    disabled={aiGenerating || (!aiPrompt.trim() && !aiCuisine)}
                    className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-brand hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {aiGenerating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Crafting your recipe with Gemini AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Generate Complete Recipe</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Preview Generated Recipe */
              <div className="space-y-5">
                <div className="bg-foreground-custom/5 border border-border-custom rounded-2xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-lg sm:text-xl font-bold text-foreground-custom">
                      {aiResult.recipeName}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] bg-brand/10 text-brand font-bold px-2.5 py-0.5 rounded-full">
                        {aiResult.category}
                      </span>
                      <span className="text-[11px] bg-foreground-custom/10 text-foreground-custom font-medium px-2.5 py-0.5 rounded-full">
                        {aiResult.cuisineType}
                      </span>
                      <span className="text-[11px] bg-foreground-custom/10 text-foreground-custom font-medium px-2.5 py-0.5 rounded-full">
                        {aiResult.preparationTime} mins • {aiResult.difficultyLevel}
                      </span>
                    </div>
                  </div>

                  {aiResult.chefTips && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
                      <strong>Chef Tip:</strong> {aiResult.chefTips}
                    </div>
                  )}

                  {/* Ingredients Preview */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-foreground-custom/60">
                      Ingredients ({aiResult.ingredients?.length || 0})
                    </h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-foreground-custom/80">
                      {aiResult.ingredients?.map((ing, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                          <span className="truncate">{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions Preview */}
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-foreground-custom/60">
                      Cooking Instructions Preview
                    </h5>
                    <p className="text-xs text-foreground-custom/80 whitespace-pre-line line-clamp-4 leading-relaxed bg-card-custom p-3 rounded-xl border border-border-custom">
                      {aiResult.instructions}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleApplyAiRecipe}
                    className="w-full sm:flex-1 bg-brand hover:bg-brand-hover text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 size={18} />
                    <span>Apply to Form (Auto-Fill)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAiResult(null);
                      setAiError('');
                    }}
                    className="w-full sm:w-auto border border-border-custom hover:bg-foreground-custom/5 text-foreground-custom font-semibold py-3.5 px-5 rounded-2xl transition-all flex items-center justify-center space-x-1.5"
                  >
                    <RefreshCw size={16} />
                    <span>Try Another</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
