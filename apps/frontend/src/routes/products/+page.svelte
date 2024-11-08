<script lang="ts">
	import { remult } from '@repo/shared';
	import { onMount } from 'svelte';
	import { Product } from '@repo/shared/entities/product';
	import { ProductController } from '@repo/shared/controllers/product';
	import { Button } from '@repo/ui';
	import { Input } from '@repo/ui';

	let products: Product[] = [];
	let newProduct = { name: '', price: 0.0, description: '' };

	const productRepo = remult.repo(Product);

	onMount(() => {
		const unsubscribe = productRepo
			.liveQuery({
				limit: 20,
				orderBy: { createdAt: 'asc' }
			})
			.subscribe((info) => {
				products = info.applyChanges(products);
			});

		return unsubscribe;
	});

	async function addProduct(e: Event) {
		e.preventDefault();
		try {
			await ProductController.insert(newProduct);
			newProduct = { name: '', price: 0.0, description: '' };
		} catch (error) {
			alert((error as { message: string }).message);
		}
	}

	async function saveProduct(product: Product) {
		try {
			await ProductController.update(product.id, product);
		} catch (error) {
			alert((error as { message: string }).message);
		}
	}

	async function deleteProduct(product: Product) {
		try {
			await ProductController.delete(product.id);
		} catch (error) {
			alert((error as { message: string }).message);
		}
	}
</script>

{#if remult.user}
	<div class="mx-auto max-w-4xl space-y-8 py-8">
		<h1 class="text-3xl font-bold">Products</h1>
		<main class="space-y-6">
			{#if productRepo.metadata.apiInsertAllowed()}
				<form on:submit={addProduct} class="space-y-4 rounded-lg border p-6 shadow-sm">
					<div class="grid gap-4 sm:grid-cols-2">
						<Input
							bind:value={newProduct.name}
							placeholder="Product name"
							required
							class="rounded-md border px-3 py-2"
						/>
						<Input
							type="number"
							step="0.01"
							bind:value={newProduct.price}
							placeholder="Price"
							required
							class="rounded-md border px-3 py-2"
						/>
						<Input
							bind:value={newProduct.description}
							placeholder="Description"
							class="rounded-md border px-3 py-2 sm:col-span-2"
						/>
					</div>
					<Button class="w-full rounded-md px-4 py-2" type="submit">Add Product</Button>
				</form>
			{/if}

			<div class="overflow-x-auto">
				<table class="w-full border-collapse">
					<thead>
						<tr class="bg-gray-100">
							<th class="border-b p-3 text-left">Name</th>
							<th class="border-b p-3 text-left">Price</th>
							<th class="border-b p-3 text-left">Description</th>
							<th class="border-b p-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each products as product (product.id)}
							<tr class="border-b hover:bg-gray-50">
								<td class="p-2">
									<Input
										bind:value={product.name}
										onchange={() => saveProduct(product)}
										class="h-7 w-full rounded-md border-0 px-3 py-0 text-xs shadow-none focus:border"
									/>
								</td>
								<td class="p-2">
									<Input
										type="number"
										step="0.01"
										bind:value={product.price}
										onchange={() => saveProduct(product)}
										class="h-7 w-full rounded-md border-0 px-3 py-0 text-xs shadow-none focus:border"
									/>
								</td>
								<td class="p-2">
									<Input
										bind:value={product.description}
										onchange={() => saveProduct(product)}
										class="h-7 w-full rounded-md border-0 px-3 py-0 text-xs shadow-none focus:border"
									/>
								</td>
								<td class="p-2">
									<div class="flex justify-end gap-2">
										<Button
											onclick={() => saveProduct(product)}
											class="h-6 rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
										>
											Save
										</Button>
										{#if productRepo.metadata.apiDeleteAllowed(product)}
											<Button
												onclick={() => deleteProduct(product)}
												class="h-6 rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
											>
												Delete
											</Button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</main>
	</div>
{:else}
	<div class="flex h-[calc(100vh-6rem)] items-center justify-center">
		<p class="text-lg">
			Please <a href="/" class="text-blue-600 hover:underline">log in</a> to view products.
		</p>
	</div>
{/if}
